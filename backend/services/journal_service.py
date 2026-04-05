"""
Journal Service for Vienna Life Assistant

Handles fetching and parsing daily journal notes from Advanced Memory (ADN).
Integrates with the MCP Advanced Memory server to read daily consolidated and IDE stream notes.
"""

import logging
import re
from typing import Dict, Any, Optional, List
from datetime import datetime
from services.mcp_clients import mcp_clients

logger = logging.getLogger(__name__)


class JournalService:
    """
    Service for fetching and parsing journal notes from Advanced Memory.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def get_daily_consolidated(self, date: str) -> Dict[str, Any]:
        """
        Get consolidated daily journal note for a specific date.

        Args:
            date: Date in YYYY-MM-DD format

        Returns:
            Dictionary with parsed journal data
        """
        try:
            # Format: daily-consolidated-YYYY-MM-DD
            note_identifier = f"daily-consolidated-{date}"

            if not mcp_clients.advanced_memory:
                self.logger.warning("Advanced Memory MCP client not available")
                raise Exception("Advanced Memory MCP client not available")

            # Read the note using ADN content tool
            result = await mcp_clients.advanced_memory.read_note(note_identifier)

            if not result.get("success"):
                error_msg = result.get("error", "Unknown error")
                self.logger.warning(f"Failed to read consolidated note for {date}: {error_msg}")
                raise Exception(f"Note not found: {error_msg}")

            note_result = result.get("result", {})
            # The read_note tool returns the content directly as a string or in a content field
            if isinstance(note_result, str):
                content = note_result
                note_data = {"title": note_identifier, "content": content}
            else:
                content = note_result.get("content", note_result.get("text", ""))
                note_data = note_result

            # Parse the markdown content
            parsed = self._parse_consolidated_note(content, date)

            return {
                "date": date,
                "content": parsed,
                "metadata": {
                    "title": note_data.get("title", note_identifier),
                    "permalink": note_data.get("permalink", ""),
                    "tags": note_data.get("tags", []),
                    "created_at": note_data.get("created_at"),
                    "updated_at": note_data.get("updated_at"),
                }
            }

        except Exception as e:
            self.logger.error(f"Error fetching consolidated journal for {date}: {e}")
            raise

    async def get_ide_streams(self, date: str) -> Dict[str, Any]:
        """
        Get all IDE stream notes for a specific date.

        Args:
            date: Date in YYYY-MM-DD format

        Returns:
            Dictionary with all IDE stream data
        """
        try:
            ides = ["antigravity", "cursor", "windsurf", "zed"]
            streams = {}

            if not mcp_clients.advanced_memory:
                self.logger.warning("Advanced Memory MCP client not available")
                raise Exception("Advanced Memory MCP client not available")

            for ide in ides:
                note_identifier = f"daily-{ide}-{date}"

                try:
                    result = await mcp_clients.advanced_memory.read_note(note_identifier)

                    if result.get("success"):
                        note_result = result.get("result", {})
                        # The read_note tool returns the content directly as a string or in a content field
                        if isinstance(note_result, str):
                            content = note_result
                            note_data = {"title": note_identifier, "content": content}
                        else:
                            content = note_result.get("content", note_result.get("text", ""))
                            note_data = note_result

                        parsed = self._parse_ide_note(content, ide, date)

                        streams[ide] = {
                            "date": date,
                            "ide": ide,
                            "content": parsed,
                            "metadata": {
                                "title": note_data.get("title", note_identifier),
                                "permalink": note_data.get("permalink", ""),
                                "tags": note_data.get("tags", []),
                                "created_at": note_data.get("created_at"),
                                "updated_at": note_data.get("updated_at"),
                            }
                        }
                    else:
                        # Note doesn't exist for this IDE, skip it
                        self.logger.debug(f"No note found for {ide} on {date}")

                except Exception as e:
                    self.logger.warning(f"Error fetching {ide} stream for {date}: {e}")
                    # Continue with other IDEs even if one fails

            if not streams:
                raise Exception(f"No IDE stream notes found for {date}")

            return {
                "date": date,
                "streams": streams,
                "metadata": {
                    "available_ides": list(streams.keys()),
                    "total_streams": len(streams)
                }
            }

        except Exception as e:
            self.logger.error(f"Error fetching IDE streams for {date}: {e}")
            raise

    def _parse_consolidated_note(self, content: str, date: str) -> Dict[str, Any]:
        """
        Parse consolidated daily note markdown into structured data.

        Args:
            content: Markdown content of the note
            date: Date string

        Returns:
            Parsed structured data
        """
        parsed = {
            "highlights": {
                "new-projects": {},
                "maintenance": {},
                "research": {},
                "insights": {},
                "mcp-news": {}
            },
            "metrics": {
                "activeProjects": 0,
                "maintenanceTasks": 0,
                "researchOutputs": 0,
                "keyInsights": 0,
                "mcpTools": 0
            },
            "achievement": "",
            "priorities": []
        }

        lines = content.split("\n")
        current_ide = None
        current_category = None
        in_achievement_section = False
        in_priorities_section = False
        achievement_lines = []
        priority_counter = 0

        for i, line in enumerate(lines):
            line_stripped = line.strip()
            original_line = line

            # Detect section headers (##)
            if line_stripped.startswith("## "):
                section_title = line_stripped[3:].strip().lower()
                in_achievement_section = False
                in_priorities_section = False
                current_ide = None
                
                # Map section titles to categories
                if "new project" in section_title or "new projects" in section_title:
                    current_category = "new-projects"
                elif "maintenance" in section_title or "fix" in section_title or "fixing" in section_title:
                    current_category = "maintenance"
                elif "research" in section_title or "documentation" in section_title:
                    current_category = "research"
                elif "insight" in section_title or "learning" in section_title or "learnings" in section_title:
                    current_category = "insights"
                elif "mcp" in section_title or "server zoo" in section_title or "ecosystem" in section_title:
                    current_category = "mcp-news"
                elif "achievement" in section_title:
                    in_achievement_section = True
                    current_category = None
                    achievement_lines = []
                elif "priority" in section_title or "tomorrow" in section_title or "focus" in section_title:
                    in_priorities_section = True
                    current_category = None
                    parsed["priorities"] = []
                else:
                    current_category = None

            # Detect IDE subsections (### Antigravity, ### Cursor, etc.)
            elif line_stripped.startswith("### "):
                ide_title = line_stripped[4:].strip().lower()
                if "antigravity" in ide_title or "ag" in ide_title:
                    current_ide = "antigravity"
                elif "cursor" in ide_title:
                    current_ide = "cursor"
                elif "windsurf" in ide_title:
                    current_ide = "windsurf"
                elif "zed" in ide_title:
                    current_ide = "zed"
                else:
                    current_ide = None

            # Parse list items
            elif line_stripped.startswith("- ") or line_stripped.startswith("* "):
                item_text = line_stripped[2:].strip()
                
                if in_priorities_section:
                    # Extract priority text (remove numbering if present)
                    priority_text = re.sub(r'^\d+\.\s*', '', item_text)
                    if priority_text:
                        parsed["priorities"].append(priority_text)
                elif current_category and current_ide:
                    if current_ide not in parsed["highlights"][current_category]:
                        parsed["highlights"][current_category][current_ide] = []
                    parsed["highlights"][current_category][current_ide].append(item_text)
                elif in_achievement_section:
                    achievement_lines.append(item_text)

            # Parse numbered priorities (1. 2. 3. etc.)
            elif re.match(r'^\d+\.\s+', line_stripped):
                if in_priorities_section:
                    priority_text = re.sub(r'^\d+\.\s*', '', line_stripped)
                    if priority_text:
                        parsed["priorities"].append(priority_text)

            # Capture achievement text (non-list lines in achievement section)
            elif in_achievement_section and line_stripped and not line_stripped.startswith("#"):
                achievement_lines.append(line_stripped)

        # Extract achievement text
        if achievement_lines:
            parsed["achievement"] = " ".join(achievement_lines).strip()

        # Count metrics
        for category, ides in parsed["highlights"].items():
            total_items = sum(len(items) for items in ides.values())
            if category == "new-projects":
                parsed["metrics"]["activeProjects"] = total_items
            elif category == "maintenance":
                parsed["metrics"]["maintenanceTasks"] = total_items
            elif category == "research":
                parsed["metrics"]["researchOutputs"] = total_items
            elif category == "insights":
                parsed["metrics"]["keyInsights"] = total_items
            elif category == "mcp-news":
                parsed["metrics"]["mcpTools"] = total_items

        return parsed

    def _parse_ide_note(self, content: str, ide: str, date: str) -> Dict[str, Any]:
        """
        Parse individual IDE stream note markdown into structured data.

        Args:
            content: Markdown content of the note
            ide: IDE name (antigravity, cursor, etc.)
            date: Date string

        Returns:
            Parsed structured data
        """
        parsed = {
            "new-projects": [],
            "maintenance": [],
            "research": [],
            "insights": [],
            "mcp-news": []
        }

        lines = content.split("\n")
        current_category = None

        for line in lines:
            line = line.strip()

            # Detect section headers
            if line.startswith("## "):
                section_title = line[3:].strip().lower()
                
                if "new project" in section_title or "new projects" in section_title:
                    current_category = "new-projects"
                elif "maintenance" in section_title or "fix" in section_title:
                    current_category = "maintenance"
                elif "research" in section_title or "documentation" in section_title:
                    current_category = "research"
                elif "insight" in section_title or "learning" in section_title:
                    current_category = "insights"
                elif "mcp" in section_title or "server zoo" in section_title:
                    current_category = "mcp-news"
                else:
                    current_category = None

            # Parse list items
            elif line.startswith("- ") or line.startswith("* "):
                item_text = line[2:].strip()
                
                if current_category and current_category in parsed:
                    parsed[current_category].append(item_text)

        return parsed


# Global instance
journal_service = JournalService()
