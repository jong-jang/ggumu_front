import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

interface Item {
  title: string;
  durationMinutes: number;
}

interface Routine {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  items: Item[];
}

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', isPublic: false, items: [] as Item[] });
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/api/routines/${id}`)
      .then((res) => {
        const data: Routine = res.data.data;
        setRoutine(data);
        setForm({ title: data.title, description: data.description, isPublic: data.isPublic, items: data.items });
      })
      .catch(() => setError('루틴을 불러오지 못했습니다.'));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }
    try {
      await api.put(`/api/routines/${id}`, form);
      setRoutine({ ...routine!, ...form });
      setEditing(false);
      setError('');
    } catch {
      setError('수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('루틴을 삭제할까요?')) return;
    try {
      await api.delete(`/api/routines/${id}`);
      navigate('/home');
    } catch {
      setError('삭제에 실패했습니다.');
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { title: '', durationMinutes: 10 }] }));

  const removeItem = (index: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));

  if (error && !routine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-gray-500 hover:text-gray-800">
            ←
          </button>
          <h1 className="text-xl font-bold">{editing ? '루틴 수정' : routine.title}</h1>
        </div>
        {!editing && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        )}
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {!editing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${routine.isPublic ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                {routine.isPublic ? '공개' : '비공개'}
              </span>
            </div>
            {routine.description && (
              <p className="text-gray-600 text-sm">{routine.description}</p>
            )}
            <ul className="space-y-2">
              {routine.items.map((item, i) => (
                <li key={i} className="bg-white rounded-xl shadow-sm p-4 flex justify-between">
                  <span className="text-gray-800 text-sm">{item.title}</span>
                  <span className="text-gray-400 text-sm">{item.durationMinutes}분</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">공개 루틴</label>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublic ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublic ? 'translate-x-5' : 'translate-x-0'}`}
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
                {form.items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(i, 'title', e.target.value)}
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
                    {form.items.length > 1 && (
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

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError('');
                  setForm({ title: routine.title, description: routine.description, isPublic: routine.isPublic, items: routine.items });
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
              >
                저장
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
