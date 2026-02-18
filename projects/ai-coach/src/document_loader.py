"""
Document loader for various file formats (TXT, PDF, DOCX).
Preserves metadata and handles encoding properly.
"""

import os
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime
import pypdf
from docx import Document


class DocumentLoader:
    """Loader for text, PDF, and DOCX documents."""

    @staticmethod
    def load_txt(file_path: str) -> Tuple[str, Dict]:
        """
        Load a text file with UTF-8 encoding.

        Args:
            file_path: Path to the text file

        Returns:
            Tuple of (content, metadata)
        """
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        # Try UTF-8 first, fallback to other encodings if needed
        encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
        content = None
        encoding_used = None

        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    content = f.read()
                encoding_used = encoding
                break
            except UnicodeDecodeError:
                continue

        if content is None:
            raise ValueError(f"Could not decode file {file_path} with any supported encoding")

        # Get file metadata
        stat = path.stat()
        metadata = {
            "source": path.name,
            "file_type": "txt",
            "file_path": str(path.absolute()),
            "file_size": stat.st_size,
            "modified_date": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "encoding": encoding_used
        }

        return content, metadata

    @staticmethod
    def load_pdf(file_path: str) -> Tuple[str, Dict]:
        """
        Load a PDF file and extract text.

        Args:
            file_path: Path to the PDF file

        Returns:
            Tuple of (content, metadata)
        """
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        try:
            reader = pypdf.PdfReader(file_path)

            # Extract text from all pages
            content_parts = []
            for page_num, page in enumerate(reader.pages, 1):
                text = page.extract_text()
                if text.strip():
                    content_parts.append(f"[Page {page_num}]\n{text}")

            content = "\n\n".join(content_parts)

            # Get metadata
            stat = path.stat()
            pdf_info = reader.metadata if reader.metadata else {}

            metadata = {
                "source": path.name,
                "file_type": "pdf",
                "file_path": str(path.absolute()),
                "file_size": stat.st_size,
                "modified_date": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "num_pages": len(reader.pages),
                "pdf_title": pdf_info.get("/Title", ""),
                "pdf_author": pdf_info.get("/Author", "")
            }

            return content, metadata

        except Exception as e:
            raise ValueError(f"Error reading PDF {file_path}: {e}")

    @staticmethod
    def load_docx(file_path: str) -> Tuple[str, Dict]:
        """
        Load a DOCX file and extract text.

        Args:
            file_path: Path to the DOCX file

        Returns:
            Tuple of (content, metadata)
        """
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        try:
            doc = Document(file_path)

            # Extract text from all paragraphs
            paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
            content = "\n\n".join(paragraphs)

            # Get metadata
            stat = path.stat()
            core_props = doc.core_properties

            metadata = {
                "source": path.name,
                "file_type": "docx",
                "file_path": str(path.absolute()),
                "file_size": stat.st_size,
                "modified_date": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "num_paragraphs": len(paragraphs),
                "docx_title": core_props.title or "",
                "docx_author": core_props.author or ""
            }

            return content, metadata

        except Exception as e:
            raise ValueError(f"Error reading DOCX {file_path}: {e}")

    @staticmethod
    def load_document(file_path: str) -> Tuple[str, Dict]:
        """
        Auto-detect file type and load document.

        Args:
            file_path: Path to the document

        Returns:
            Tuple of (content, metadata)
        """
        path = Path(file_path)
        extension = path.suffix.lower()

        if extension == '.txt':
            return DocumentLoader.load_txt(file_path)
        elif extension == '.pdf':
            return DocumentLoader.load_pdf(file_path)
        elif extension == '.docx':
            return DocumentLoader.load_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {extension}")

    @staticmethod
    def load_directory(directory_path: str, recursive: bool = True) -> List[Tuple[str, Dict]]:
        """
        Load all supported documents from a directory.

        Args:
            directory_path: Path to the directory
            recursive: Whether to search subdirectories

        Returns:
            List of (content, metadata) tuples
        """
        path = Path(directory_path)

        if not path.exists() or not path.is_dir():
            raise ValueError(f"Invalid directory: {directory_path}")

        supported_extensions = {'.txt', '.pdf', '.docx'}
        documents = []

        # Get all files
        if recursive:
            files = path.rglob('*')
        else:
            files = path.glob('*')

        # Load each supported file
        for file_path in files:
            if file_path.is_file() and file_path.suffix.lower() in supported_extensions:
                # Skip symlinks that don't point to valid files
                if file_path.is_symlink():
                    try:
                        if not file_path.resolve().exists():
                            print(f"Skipping broken symlink: {file_path}")
                            continue
                    except Exception:
                        print(f"Skipping invalid symlink: {file_path}")
                        continue

                try:
                    content, metadata = DocumentLoader.load_document(str(file_path))
                    documents.append((content, metadata))
                except Exception as e:
                    print(f"Error loading {file_path}: {e}")

        return documents
