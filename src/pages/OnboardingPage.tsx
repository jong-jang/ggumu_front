import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const JOB_OPTIONS = [
  { value: 'DEVELOPER', label: '개발자' },
  { value: 'DESIGNER', label: '디자이너' },
  { value: 'STUDENT', label: '학생' },
  { value: 'OTHER', label: '기타' },
];

const WORK_STYLE_OPTIONS = [
  { value: 'FOCUSED', label: '집중형' },
  { value: 'FLEXIBLE', label: '유연형' },
  { value: 'BALANCED', label: '균형형' },
];

const GOAL_OPTIONS = [
  { value: 'PRODUCTIVITY', label: '생산성 향상' },
  { value: 'HEALTH', label: '건강 관리' },
  { value: 'SELF_IMPROVEMENT', label: '자기 계발' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ job: '', workStyle: '', goal: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.job || !form.workStyle || !form.goal) {
      setError('모든 항목을 선택해 주세요.');
      return;
    }
    try {
      await api.post('/api/users/onboarding', form);
      navigate('/home');
    } catch {
      setError('온보딩 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">꾸무에 오신 걸 환영해요!</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">직업</label>
            <div className="grid grid-cols-2 gap-2">
              {JOB_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, job: opt.value }))}
                  className={`py-2 rounded-lg border text-sm ${
                    form.job === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">업무 스타일</label>
            <div className="grid grid-cols-3 gap-2">
              {WORK_STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, workStyle: opt.value }))}
                  className={`py-2 rounded-lg border text-sm ${
                    form.workStyle === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">목표</label>
            <div className="grid grid-cols-1 gap-2">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, goal: opt.value }))}
                  className={`py-2 rounded-lg border text-sm ${
                    form.goal === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
