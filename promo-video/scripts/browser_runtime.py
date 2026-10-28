"""Resolve a browser for Playwright, preferring its bundled Chromium when present."""
import os
import shutil


SYSTEM_CHROME = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
]


def executable(playwright):
    bundled = playwright.chromium.executable_path
    if bundled and os.path.exists(bundled):
        return bundled
    configured = os.environ.get("PLAYWRIGHT_CHROME_PATH")
    if configured and os.path.exists(configured):
        return configured
    for path in SYSTEM_CHROME:
        if os.path.exists(path):
            return path
    for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "msedge"):
        path = shutil.which(name)
        if path:
            return path
    return None


def launch_options(playwright):
    path = executable(playwright)
    if not path:
        raise RuntimeError("找不到浏览器；请安装 Google Chrome，或运行 playwright install chromium")
    return {} if path == playwright.chromium.executable_path else {"executable_path": path}
