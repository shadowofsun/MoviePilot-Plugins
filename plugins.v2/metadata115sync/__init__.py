#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
元数据115同步插件。

将本地硬链接目录（b目录）中已刮削的元数据文件（nfo/海报/mediainfo.json）同步到115网盘，
避免 MoviePilot 目录监控转移时在115上重复刮削，同时保留元数据。

支持：
- 手动触发同步（API / 命令）
- 定时同步（cron 或 interval）
- 目录映射可配置
"""
import json
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from app.core.config import settings
from app.core.event import eventmanager
from app.helper.storage import StorageHelper
from app.log import logger
from app.plugins import _PluginBase
from app.schemas.types import EventType

# 元数据扩展名（需要同步到115）
_META_EXTS = {".nfo", ".jpg", ".jpeg", ".png", ".json"}
# 排除的视频/字幕/音频扩展名（不处理）
_MEDIA_EXTS = {
    ".mp4", ".mkv", ".ts", ".avi", ".mov", ".wmv", ".flv",
    ".rmvb", ".m2ts", ".iso", ".bdmv", ".m4v", ".webm", ".mpg", ".mpeg",
}
_SUB_EXTS = {".srt", ".ass", ".ssa", ".sup", ".sub", ".idx", ".vtt"}
_AUDIO_EXTS = {".aac", ".flac", ".mp3", ".wav", ".ac3", ".dts", ".mka", ".ogg", ".opus"}


class Metadata115Sync(_PluginBase):
    """元数据115同步插件。"""

    plugin_name = "元数据115同步"
    plugin_desc = "将本地硬链接目录已刮削的元数据文件同步到115网盘，避免重复刮削。"
    plugin_icon = "metadata115sync.png"
    plugin_version = "1.0.0"
    plugin_author = "local"
    plugin_label = "媒体整理"
    plugin_config_prefix = "metadata115sync_"
    plugin_order = 100
    auth_level = 1

    _enabled = False
    _cron = ""
    _interval = 0
    _onlyonce = False
    _notify = False
    _dir_map = []
    _upload_delay = 0.5
    _trigger_monitor = False
    _scheduler: Optional[BackgroundScheduler] = None
    _last_run = None
    _last_result = ""

    def init_plugin(self, config: dict = None) -> None:
        """根据插件配置初始化运行状态。"""
        self.stop_service()
        self._enabled = False
        self._cron = ""
        self._interval = 0
        self._onlyonce = False
        self._notify = False
        self._dir_map = []
        self._upload_delay = 0.5
        self._trigger_monitor = False
        if not config:
            return
        self._enabled = bool(config.get("enabled"))
        self._cron = str(config.get("cron") or "")
        self._interval = int(config.get("interval") or 0)
        self._onlyonce = bool(config.get("onlyonce"))
        self._notify = bool(config.get("notify"))
        self._dir_map = config.get("dir_map") or []
        self._upload_delay = float(config.get("upload_delay") or 0.5)
        self._trigger_monitor = bool(config.get("trigger_monitor"))

        # 立即运行一次
        if self._onlyonce:
            self._scheduler = BackgroundScheduler(timezone=settings.TZ)
            self._scheduler.add_job(
                func=self.__sync_all,
                trigger="date",
                run_date=datetime.now(tz=pytz.timezone(settings.TZ)) + timedelta(seconds=3),
                name="元数据115同步（立即运行）",
            )
            self._onlyonce = False
            self.update_config({
                "enabled": self._enabled,
                "cron": self._cron,
                "interval": self._interval,
                "onlyonce": False,
                "notify": self._notify,
                "dir_map": self._dir_map,
                "upload_delay": self._upload_delay,
                "trigger_monitor": self._trigger_monitor,
            })
            if self._scheduler.get_jobs():
                self._scheduler.start()

    def get_state(self) -> bool:
        """获取插件启用状态。"""
        return self._enabled

    @staticmethod
    def get_command() -> List[Dict[str, Any]]:
        """返回插件远程命令列表。"""
        return [
            {
                "cmd": "/sync115",
                "event": EventType.PluginAction,
                "desc": "手动触发元数据115同步",
                "category": "媒体整理",
            }
        ]

    def get_api(self) -> List[Dict[str, Any]]:
        """返回插件 API 列表。"""
        return [
            {
                "path": "/run",
                "endpoint": self.api_run,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "手动触发元数据115同步（全部目录）",
            },
            {
                "path": "/run_dir",
                "endpoint": self.api_run_dir,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "手动触发指定目录的元数据115同步",
            },
            {
                "path": "/status",
                "endpoint": self.api_status,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取同步状态",
            },
            {
                "path": "/check",
                "endpoint": self.api_check,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "检测115网盘风控状态",
            },
        ]

    @staticmethod
    def get_render_mode() -> Tuple[str, str]:
        """声明插件使用 Vue 联邦组件渲染。"""
        return "vue", "dist/assets"

    def get_form(self) -> Tuple[List[dict], Dict[str, Any]]:
        """Vue 模式下返回默认配置模型。"""
        return [], self._current_config()

    def get_page(self) -> List[dict]:
        """Vue 模式下详情页由远程 Page 组件渲染。"""
        return []

    def get_sidebar_nav(self) -> List[Dict[str, Any]]:
        """将插件注册到主界面侧栏。"""
        if not self.get_state():
            return []
        return [
            {
                "nav_key": "main",
                "title": "元数据115同步",
                "icon": "mdi-cloud-upload",
                "section": "system",
                "permission": "manage",
                "order": 50,
            }
        ]

    def get_service(self) -> List[Dict[str, Any]]:
        """注册插件定时服务。"""
        if not self._enabled:
            return []
        services = []
        if self._cron:
            services.append({
                "id": "Metadata115SyncCron",
                "name": "元数据115同步（cron）",
                "trigger": CronTrigger.from_crontab(self._cron),
                "func": self.__sync_all,
                "kwargs": {},
            })
        if self._interval and self._interval > 0:
            services.append({
                "id": "Metadata115SyncInterval",
                "name": "元数据115同步（间隔）",
                "trigger": IntervalTrigger(minutes=self._interval),
                "func": self.__sync_all,
                "kwargs": {},
            })
        return services

    def stop_service(self) -> None:
        """停止插件后台服务并释放资源。"""
        try:
            if self._scheduler:
                self._scheduler.remove_all_jobs()
                if self._scheduler.running:
                    self._scheduler.shutdown()
                self._scheduler = None
        except Exception as e:
            logger.error(f"停止元数据115同步服务失败：{e}")

    def _current_config(self) -> Dict[str, Any]:
        """返回当前配置。"""
        return {
            "enabled": self._enabled,
            "cron": self._cron,
            "interval": self._interval,
            "onlyonce": self._onlyonce,
            "notify": self._notify,
            "dir_map": self._dir_map,
            "upload_delay": self._upload_delay,
            "trigger_monitor": self._trigger_monitor,
        }

    def api_run(self) -> Dict[str, Any]:
        """API：手动触发全部目录同步。"""
        if not self._enabled:
            return {"success": False, "message": "插件未启用"}
        self.__sync_all()
        return {"success": True, "message": "同步完成", "result": self._last_result}

    def api_run_dir(self, index: int = 0) -> Dict[str, Any]:
        """API：手动触发指定目录同步。

        :param index: 目录映射索引
        """
        if not self._enabled:
            return {"success": False, "message": "插件未启用"}
        if not self._dir_map or index < 0 or index >= len(self._dir_map):
            return {"success": False, "message": f"目录索引无效: {index}"}
        item = self._dir_map[index]
        local_base = item.get("local") or ""
        remote_base = item.get("remote") or ""
        if not local_base or not remote_base:
            return {"success": False, "message": "目录映射配置不完整"}
        self._last_run = time.strftime("%Y-%m-%d %H:%M:%S")
        result = self.__sync_dir(local_base, remote_base)
        self._last_result = f"[{local_base}] 上传: {result[0]}, 跳过: {result[1]}, 失败: {result[2]}"
        logger.info(f"元数据115同步（单目录）完成：{self._last_result}")
        if self._notify:
            self.post_message(title="元数据115同步", text=self._last_result)
        return {"success": True, "message": "同步完成", "result": self._last_result}

    def api_status(self) -> Dict[str, Any]:
        """API：获取同步状态。"""
        return {
            "success": True,
            "last_run": self._last_run,
            "last_result": self._last_result,
            "enabled": self._enabled,
        }

    def api_check(self) -> Dict[str, Any]:
        """API：检测115网盘风控状态。"""
        try:
            from app.modules.filemanager.storages.u115 import U115Pan

            u115 = U115Pan()
            # 读取风控冷却状态
            limit_until = getattr(u115, "_limit_until", 0.0)
            now = time.time()
            in_cooldown = limit_until > now
            cooldown_remaining = max(0, int(limit_until - now)) if in_cooldown else 0
            # 读取速率统计
            rate_stats = getattr(u115, "_rate_stats", None)
            qps = rate_stats.get_qps() if rate_stats else 0
            qpm = rate_stats.get_qpm() if rate_stats else 0
            qph = rate_stats.get_qph() if rate_stats else 0
            # 读取限流器
            api_limiter = getattr(u115, "_api_limiter", None)
            download_limiter = getattr(u115, "_download_limiter", None)
            api_qps = getattr(api_limiter, "qps", None) if api_limiter else None
            download_qps = getattr(download_limiter, "qps", None) if download_limiter else None

            if in_cooldown:
                status = "风控冷却中"
                level = "warning"
            elif qpm >= 100:
                status = "接近风控阈值"
                level = "warning"
            else:
                status = "正常"
                level = "success"

            return {
                "success": True,
                "status": status,
                "level": level,
                "in_cooldown": in_cooldown,
                "cooldown_remaining": cooldown_remaining,
                "qps": qps,
                "qpm": qpm,
                "qph": qph,
                "api_qps_limit": api_qps,
                "download_qps_limit": download_qps,
                "check_time": time.strftime("%Y-%m-%d %H:%M:%S"),
            }
        except Exception as e:
            logger.error(f"元数据115同步：检测115风控状态失败: {e}")
            return {"success": False, "message": f"检测失败: {e}"}

    @eventmanager.register(EventType.TransferComplete)
    def on_transfer_complete(self, event) -> None:
        """监听整理完成事件，自动触发元数据同步。"""
        if not self._enabled or not self._trigger_monitor:
            return
        logger.info("元数据115同步：检测到整理完成事件，触发同步")
        self.__sync_all()

    def __sync_all(self) -> None:
        """执行所有目录的元数据同步。"""
        self._last_run = time.strftime("%Y-%m-%d %H:%M:%S")
        if not self._dir_map:
            self._last_result = "未配置目录映射"
            logger.warn("元数据115同步：未配置目录映射")
            return

        total_uploaded = 0
        total_skipped = 0
        total_failed = 0
        for item in self._dir_map:
            local_base = item.get("local") or ""
            remote_base = item.get("remote") or ""
            if not local_base or not remote_base:
                continue
            result = self.__sync_dir(local_base, remote_base)
            total_uploaded += result[0]
            total_skipped += result[1]
            total_failed += result[2]

        self._last_result = f"上传: {total_uploaded}, 跳过(已存在): {total_skipped}, 失败: {total_failed}"
        logger.info(f"元数据115同步完成：{self._last_result}")
        if self._notify:
            self.post_message(title="元数据115同步", text=self._last_result)

    def __sync_dir(self, local_base: str, remote_base: str) -> Tuple[int, int, int]:
        """同步单个目录的元数据文件到115。

        :param local_base: 本地目录路径
        :param remote_base: 115目录路径
        :return: (上传数, 跳过数, 失败数)
        """
        from app.modules.filemanager.storages.u115 import U115Pan

        local_base_path = Path(local_base)
        if not local_base_path.exists():
            logger.warn(f"元数据115同步：本地目录不存在 {local_base}")
            return 0, 0, 0

        # 初始化115存储
        sh = StorageHelper()
        storage = sh.get_storage("u115")
        if not storage:
            logger.error("元数据115同步：未找到115存储配置")
            return 0, 0, 0
        u115 = U115Pan()
        u115.init_storage()
        u115.set_config(storage.config)

        logger.info(f"元数据115同步：处理 {local_base} -> {remote_base}")
        # 列出115已存在文件
        remote_files = self.__list_remote_files(u115, remote_base)
        total_uploaded = 0
        total_skipped = 0
        total_failed = 0
        # 遍历本地元数据文件
        for root, dirs, files in __import__("os").walk(local_base_path):
            dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("@eaDir", "@Recycle", "#recycle")]
            for fname in files:
                # 检测115风控，风控中则停止同步
                if getattr(u115, "_limit_until", 0) and time.time() < u115._limit_until:
                    logger.warn(f"元数据115同步：115风控冷却中，停止同步 {local_base}")
                    return total_uploaded, total_skipped, total_failed
                local_file = Path(root) / fname
                if not self.__is_metadata(local_file):
                    continue
                rel = local_file.relative_to(local_base_path)
                remote_path = (Path(remote_base) / rel).as_posix()
                if remote_path in remote_files:
                    total_skipped += 1
                    continue
                try:
                    target_dir = u115.get_folder(Path(remote_path).parent)
                    if not target_dir:
                        total_failed += 1
                        continue
                    new_item = u115.upload(target_dir, local_file)
                    if new_item:
                        total_uploaded += 1
                    else:
                        total_failed += 1
                    # 上传间隔，避免触发115风控
                    if self._upload_delay > 0:
                        time.sleep(self._upload_delay)
                except Exception as e:
                    logger.error(f"元数据115同步：上传失败 {remote_path}: {e}")
                    total_failed += 1
        return total_uploaded, total_skipped, total_failed

    @staticmethod
    def __is_metadata(path: Path) -> bool:
        """判断是否为需要同步的元数据文件。"""
        ext = path.suffix.lower()
        if ext in _MEDIA_EXTS or ext in _SUB_EXTS or ext in _AUDIO_EXTS:
            return False
        return ext in _META_EXTS

    @staticmethod
    def __list_remote_files(u115, remote_base: str, max_depth: int = 6) -> set:
        """递归列出115目录下所有文件路径。"""
        from app import schemas
        result = set()

        def _walk(fileitem, depth):
            if depth > max_depth:
                return
            try:
                items = u115.list(fileitem)
            except Exception as e:
                logger.error(f"元数据115同步：列出 {fileitem.path} 失败: {e}")
                return
            for it in items:
                if it.type == "dir":
                    _walk(it, depth + 1)
                else:
                    result.add(it.path)

        root = schemas.FileItem(storage="u115", path=remote_base)
        _walk(root, 0)
        return result
