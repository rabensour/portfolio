"""
Vectorstore wrapper for ChromaDB.
Manages collections, embeddings, and semantic search.
"""

import chromadb
from chromadb.config import Settings
from typing import List, Dict, Optional
from pathlib import Path


class VectorStore:
    """Wrapper for ChromaDB vector database."""

    def __init__(self, persist_directory: str):
        """
        Initialize ChromaDB client.

        Args:
            persist_directory: Directory to persist the database
        """
        self.persist_directory = Path(persist_directory)
        self.persist_directory.mkdir(parents=True, exist_ok=True)

        # Initialize ChromaDB client with persistence
        self.client = chromadb.PersistentClient(
            path=str(self.persist_directory)
        )

        self.collections = {}

    def create_collection(self, name: str, metadata: Dict = None) -> None:
        """
        Create or get a collection.

        Args:
            name: Collection name
            metadata: Optional metadata for the collection
        """
        collection_metadata = metadata or {}
        collection_metadata["hnsw:space"] = "cosine"  # Use cosine similarity

        self.collections[name] = self.client.get_or_create_collection(
            name=name,
            metadata=collection_metadata
        )

    def add_chunks(
        self,
        collection_name: str,
        chunks: List[Dict],
        batch_size: int = 100
    ) -> int:
        """
        Add chunks to a collection.

        Args:
            collection_name: Name of the collection
            chunks: List of chunk dictionaries (must have 'text' field)
            batch_size: Number of chunks to add at once

        Returns:
            Number of chunks added
        """
        if collection_name not in self.collections:
            raise ValueError(f"Collection {collection_name} not initialized")

        collection = self.collections[collection_name]

        # Process in batches
        total_added = 0
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]

            # Extract texts and metadata
            texts = [chunk["text"] for chunk in batch]
            metadatas = []
            ids = []

            for j, chunk in enumerate(batch):
                # Create unique ID
                chunk_id = f"{collection_name}_{i + j}_{hash(chunk['text'][:100])}"
                ids.append(chunk_id)

                # Prepare metadata (ChromaDB requires all values to be strings, ints, or floats)
                metadata = {}
                for key, value in chunk.items():
                    if key != "text":
                        # Convert to string if complex type
                        if isinstance(value, (str, int, float, bool)):
                            metadata[key] = value
                        else:
                            metadata[key] = str(value)

                metadatas.append(metadata)

            # Add to collection
            collection.add(
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )

            total_added += len(batch)

        return total_added

    def search(
        self,
        collection_name: str,
        query: str,
        n_results: int = 5,
        where: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search for similar chunks in a collection.

        Args:
            collection_name: Name of the collection
            query: Query text
            n_results: Number of results to return
            where: Optional metadata filter

        Returns:
            List of results with text, metadata, and distance
        """
        if collection_name not in self.collections:
            # Try to load the collection
            try:
                self.collections[collection_name] = self.client.get_collection(collection_name)
            except Exception:
                return []

        collection = self.collections[collection_name]

        # Perform query
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where
        )

        # Format results
        formatted_results = []
        if results and results['documents'] and len(results['documents']) > 0:
            documents = results['documents'][0]
            metadatas = results['metadatas'][0] if results['metadatas'] else []
            distances = results['distances'][0] if results['distances'] else []

            for i, doc in enumerate(documents):
                result = {
                    "text": doc,
                    "metadata": metadatas[i] if i < len(metadatas) else {},
                    "distance": distances[i] if i < len(distances) else None
                }
                formatted_results.append(result)

        return formatted_results

    def get_collection_count(self, collection_name: str) -> int:
        """Get the number of items in a collection."""
        if collection_name not in self.collections:
            try:
                self.collections[collection_name] = self.client.get_collection(collection_name)
            except Exception:
                return 0

        collection = self.collections[collection_name]
        return collection.count()

    def delete_collection(self, collection_name: str) -> None:
        """Delete a collection."""
        self.client.delete_collection(name=collection_name)
        if collection_name in self.collections:
            del self.collections[collection_name]

    def list_collections(self) -> List[str]:
        """List all collection names."""
        collections = self.client.list_collections()
        return [col.name for col in collections]

    def collection_exists(self, collection_name: str) -> bool:
        """Check if a collection exists."""
        return collection_name in self.list_collections()
