import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Routine {
  id: number;
  title: string;
  description: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/routines/me')
      .then((res) => setRoutines(res.data.data))
      .catch(() => setError('루틴을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">내 루틴</h1>
        <button
          onClick={() => navigate('/routines/create')}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          + 새 루틴
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {loading && <p className="text-center text-gray-500 mt-8">불러오는 중...</p>}
        {error && <p className="text-center text-red-500 mt-8">{error}</p>}
        {!loading && !error && routines.length === 0 && (
          <p className="text-center text-gray-400 mt-8">아직 루틴이 없어요. 첫 루틴을 만들어 보세요!</p>
        )}
        <ul className="space-y-3 mt-2">
          {routines.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => navigate(`/routines/${r.id}`)}
                className="w-full text-left bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800">{r.title}</p>
                {r.description && (
                  <p className="text-sm text-gray-500 mt-1 truncate">{r.description}</p>
                )}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
