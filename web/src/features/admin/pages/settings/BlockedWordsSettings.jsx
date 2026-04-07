import { useEffect, useState } from "react";
import { adminApi } from "../../../../api/adminApi";

export default function BlockedWordsSettings() {
  const [word, setWord] = useState("");
  const [items, setItems] = useState([]);

  async function loadWords() {
    try {
      const res = await adminApi.getBlockedWords();
      setItems(res.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadWords();
  }, []);

  async function handleAdd() {
    if (!word.trim()) return;

    try {
      await adminApi.addBlockedWord({ word: word.trim() });
      setWord("");
      await loadWords();
    } catch (error) {
      console.error(error);
      alert("Failed to add blocked word");
    }
  }

  async function handleDelete(id) {
    try {
      await adminApi.deleteBlockedWord(id);
      await loadWords();
    } catch (error) {
      console.error(error);
      alert("Failed to delete blocked word");
    }
  }

  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">Blocked Words</h3>

      <div className="mt-6 flex gap-3">
        <input
          className="theme-input flex-1"
          placeholder="Add blocked word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button className="theme-btn-primary" onClick={handleAdd}>
          Add
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#171717] px-4 py-3"
          >
            <span className="text-sm text-white">{item.word}</span>
            <button
              className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300"
              onClick={() => handleDelete(item.id)}
            >
              Remove
            </button>
          </div>
        ))}

        {!items.length && (
          <div className="rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm text-[#97a3a0]">
            No blocked words found.
          </div>
        )}
      </div>
    </div>
  );
}