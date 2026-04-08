import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Item {
  title: string;
  durationMinutes: number;
}

export default function RoutineCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [items, setItems] = useState<Item[]>([{ title: '', durationMinutes: 10 }]);
  const [error, setError] = useState('');

  const addItem = () => setItems((prev) => [...prev, { title: '', durationMinutes: 10 }]);

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('루틴 제목을 입력해 주세요.');
      return;
    }
    const validItems = items.filter((item) => item.title.trim());
    try {
      await api.post('/api/routines', { title, description, isPublic, items: validItems });
      navigate('/home');
    } catch {
      setError('루틴 생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800">
          ←
        </button>
        <h1 className="text-xl font-bold">새 루틴 만들기</h1>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="루틴 제목"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">설명 (선택)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="간단한 설명"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">공개 루틴</label>
            <button
              type="button"
              onClick={() => setIsPublic((prev) => !prev)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isPublic ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">항목</label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-indigo-600 hover:underline"
              >
                + 추가
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(i, 'title', e.target.value)}
                    placeholder="항목 이름"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    type="number"
                    value={item.durationMinutes}
                    min={1}
                    onChange={(e) => updateItem(i, 'durationMinutes', Number(e.target.value))}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <span className="text-xs text-gray-400">분</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            저장
          </button>
        </form>
      </main>
    </div>
  );
}
