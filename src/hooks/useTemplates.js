import { useCallback, useEffect, useState } from 'react';
import * as templateApi from '../services/templateService';

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await templateApi.fetchTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    await templateApi.deleteTemplate(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return { templates, loading, error, reload: load, remove };
}
