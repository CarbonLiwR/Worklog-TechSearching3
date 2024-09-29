from fastapi import APIRouter


from backend.app.worklog.api.v1.add import router as add_router
from backend.app.worklog.api.v1.show import router as show_router
from backend.app.worklog.api.v1.search import router as search_router

router = APIRouter()

router.include_router(add_router)
router.include_router(search_router)
router.include_router(show_router)

