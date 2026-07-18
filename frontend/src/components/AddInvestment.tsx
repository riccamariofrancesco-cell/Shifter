import React, { useState } from 'react';
import InputField from './InputField';
import Button from './Button';
import { investmentsAPI } from '../services/api';

interface AddInvestmentProps {
  onClose: () => void;
  onInvestmentAdded: () => void;
}

const AddInvestment: React.FC<AddInvestmentProps> = ({ onClose, onInvestmentAdded }) => {
  const [sourceName, setSourceName] = useState('');
  const [type, setType] = useState<'stocks' | 'etfs' | 'funds' | 'bonds'>('stocks');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await investmentsAPI.createInvestment({
        sourceName,
        type,
        amount: parseFloat(amount)
      });
      onInvestmentAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Aggiungi Nuovo Investimento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sourceName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Fonte
            </label>
            <InputField
              id="sourceName"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="Inserisci il nome della fonte (es. Portfolio Azionario)"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo di Investimento
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="stocks">Azioni</option>
              <option value="etfs">ETF</option>
              <option value="funds">Fondi</option>
              <option value="bonds">Obbligazioni</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Importo (€)
            </label>
            <InputField
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Inserisci l'importo"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4" role="alert">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              {loading ? 'Creazione...' : 'Crea Investimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvestment;