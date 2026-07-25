"""Logging configuration for the API process."""

import logging


def configure_logging(log_level: str) -> None:
    """Configure process logging once with a consistent, machine-readable format."""

    logging.basicConfig(
        level=log_level.upper(),
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        force=True,
    )
