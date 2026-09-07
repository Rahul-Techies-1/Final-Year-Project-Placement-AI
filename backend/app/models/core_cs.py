"""
Core CS model compatibility module.

The actual Core CS SQLAlchemy models are defined in:

- core_cs_topic.py
- core_cs_problem.py
- core_cs_progress.py

This file re-exports them so existing imports such as:

    from app.models.core_cs import CoreCSTopic, CoreCSProblem

continue to work without creating duplicate SQLAlchemy models.
"""

from app.models.core_cs_topic import CoreCSTopic
from app.models.core_cs_problem import CoreCSProblem

__all__ = [
    "CoreCSTopic",
    "CoreCSProblem",
]