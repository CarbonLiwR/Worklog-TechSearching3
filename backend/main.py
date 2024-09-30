#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path

import uvicorn

from backend.core.registrar import register_app
# from backend.app.worklog.service.utils import initialize_model

app = register_app()

# @app.on_event("startup")
# async def startup():
#     """在应用程序启动时加载模型"""
#     print("Initializing model on startup...\n")
#     await initialize_model()
#     print("Model initialized on startup.\n")

if __name__ == '__main__':
    # 使用 uvicorn.run 来启动应用，触发 startup 事件
    try:
        uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
    except Exception as e:
        raise e
