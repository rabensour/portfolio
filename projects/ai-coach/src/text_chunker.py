"""
Text chunker for splitting documents into semantic chunks.
Uses intelligent splitting to preserve context and meaning.
"""

from typing import List, Dict
import re


class TextChunker:
    """Intelligent text chunker that preserves semantic meaning."""

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        """
        Initialize chunker.

        Args:
            chunk_size: Target size for chunks (in characters)
            chunk_overlap: Number of characters to overlap between chunks
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str, metadata: Dict = None) -> List[Dict]:
        """
        Split text into semantic chunks.

        Args:
            text: Text to split
            metadata: Optional metadata to attach to each chunk

        Returns:
            List of chunk dictionaries with text and metadata
        """
        if not text or not text.strip():
            return []

        # First, try to split on double newlines (paragraphs)
        paragraphs = self._split_into_paragraphs(text)

        # Build chunks from paragraphs
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            # If paragraph itself is too large, split it further
            if len(para) > self.chunk_size:
                # First, add current chunk if it exists
                if current_chunk:
                    chunks.append(current_chunk)
                    current_chunk = ""

                # Split large paragraph
                sub_chunks = self._split_large_paragraph(para)
                chunks.extend(sub_chunks)
            else:
                # Try to add paragraph to current chunk
                if len(current_chunk) + len(para) + 2 <= self.chunk_size:
                    if current_chunk:
                        current_chunk += "\n\n" + para
                    else:
                        current_chunk = para
                else:
                    # Current chunk is full, start new one
                    if current_chunk:
                        chunks.append(current_chunk)
                    current_chunk = para

        # Add final chunk
        if current_chunk:
            chunks.append(current_chunk)

        # Add overlap between chunks
        chunks_with_overlap = self._add_overlap(chunks)

        # Build chunk dictionaries with metadata
        chunk_dicts = []
        for i, chunk_text in enumerate(chunks_with_overlap):
            chunk_dict = {
                "text": chunk_text,
                "chunk_index": i,
                "total_chunks": len(chunks_with_overlap)
            }

            # Add source metadata if provided
            if metadata:
                chunk_dict.update({
                    f"source_{k}": v for k, v in metadata.items()
                })

            chunk_dicts.append(chunk_dict)

        return chunk_dicts

    def _split_into_paragraphs(self, text: str) -> List[str]:
        """Split text into paragraphs on double newlines."""
        # Split on double newlines, filter empty
        paragraphs = re.split(r'\n\s*\n', text)
        return [p.strip() for p in paragraphs if p.strip()]

    def _split_large_paragraph(self, para: str) -> List[str]:
        """Split a large paragraph into sentence-based chunks."""
        # Split on sentence boundaries
        sentences = re.split(r'(?<=[.!?])\s+', para)

        chunks = []
        current_chunk = ""

        for sentence in sentences:
            if len(current_chunk) + len(sentence) + 1 <= self.chunk_size:
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence
            else:
                if current_chunk:
                    chunks.append(current_chunk)

                # If single sentence is too large, split it hard
                if len(sentence) > self.chunk_size:
                    hard_chunks = self._hard_split(sentence)
                    chunks.extend(hard_chunks[:-1])
                    current_chunk = hard_chunks[-1] if hard_chunks else ""
                else:
                    current_chunk = sentence

        if current_chunk:
            chunks.append(current_chunk)

        return chunks

    def _hard_split(self, text: str) -> List[str]:
        """Hard split text into chunks (last resort)."""
        chunks = []
        for i in range(0, len(text), self.chunk_size):
            chunks.append(text[i:i + self.chunk_size])
        return chunks

    def _add_overlap(self, chunks: List[str]) -> List[str]:
        """Add overlap between consecutive chunks."""
        if len(chunks) <= 1 or self.chunk_overlap == 0:
            return chunks

        overlapped_chunks = [chunks[0]]

        for i in range(1, len(chunks)):
            prev_chunk = chunks[i - 1]
            current_chunk = chunks[i]

            # Take last N characters from previous chunk
            overlap_text = prev_chunk[-self.chunk_overlap:] if len(prev_chunk) > self.chunk_overlap else prev_chunk

            # Try to start overlap at a word boundary
            space_idx = overlap_text.find(' ')
            if space_idx != -1:
                overlap_text = overlap_text[space_idx + 1:]

            # Combine with current chunk
            overlapped_chunk = overlap_text + "\n...\n" + current_chunk
            overlapped_chunks.append(overlapped_chunk)

        return overlapped_chunks

    def chunk_documents(self, documents: List[tuple]) -> List[Dict]:
        """
        Chunk multiple documents.

        Args:
            documents: List of (content, metadata) tuples

        Returns:
            List of all chunks from all documents
        """
        all_chunks = []

        for content, metadata in documents:
            chunks = self.chunk_text(content, metadata)
            all_chunks.extend(chunks)

        return all_chunks
