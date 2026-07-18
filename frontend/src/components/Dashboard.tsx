import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import SectionCard from './SectionCard';
import { accountsAPI, investmentsAPI, cryptoAPI } from '../services/api';
import AddAccount from './AddAccount';
import AddInvestment from './AddInvestment';
import AddCrypto from './AddCrypto';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'accounts' | 'investments' | 'crypto' | 'account'>('accounts');
  const [accounts, setAccounts] = useState<Array<{ id: number; sourceName: string; type: string; amount: number }>>([]);
  const [investments, setInvestments] = useState<Array<{ id: number; sourceName: string; type: string; amount: number }>>([]);
  const [crypto, setCrypto] = useState<Array<{ id: number; sourceName: string; type: string; amount: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [showAddCryptoModal, setShowAddCryptoModal] = useState(false);

  // Fetch data for all sections
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch accounts
      const accountsResponse = await accountsAPI.getAccounts();
      setAccounts(accountsResponse.data.accounts || []);

      // Fetch investments
      const investmentsResponse = await investmentsAPI.getInvestments();
      setInvestments(investmentsResponse.data.investments || []);

      // Fetch crypto
      const cryptoResponse = await cryptoAPI.getCryptos();
      setCrypto(cryptoResponse.data.cryptos || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when user changes
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalAssets = accounts.reduce((sum, acc) => sum + acc.amount, 0) +
                     investments.reduce((sum, inv) => sum + inv.amount, 0) +
                     crypto.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Content Panel */}
        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {(() => {
                switch (activeSection) {
                  case 'accounts': return 'Conti Correnti e Contanti';
                  case 'investments': return 'Investimenti';
                  case 'crypto': return 'Criptovalute';
                  case 'account': return 'Impostazioni Account';
                  default: return 'Dashboard';
                }
              })}
            </h1>
            <p className="mt-1 text-gray-600">
              Panoramica del tuo patrimonio totale: <span className="font-semibold text-lg">€{totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-b-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento dati...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          {/* Section Content */}
          <div className="space-y-6">
            {activeSection === 'account' ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Impostazioni Account</h2>
                {user ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">ID Utente:</span> {user.id}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    {user.name && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Nome:</span> {user.name}
                      </div)
                    }
                  </div>
                ) : (
                  <p className="text-gray-600">Caricamento informazioni utente...</p>
                )}
                {/* In a real app, you would have a form here to edit profile and change password */}
              </div>
            ) : (
              <>
                {/* Action Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      if (activeSection === 'accounts') setShowAddAccountModal(true);
                      else if (activeSection === 'investments') setShowAddInvestmentModal(true);
                      else if (activeSection === 'crypto') setShowAddCryptoModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center"
                  >
                    <span className="mr-2">+</span> Aggiungi Fonte
                  </button>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-6">
                  {activeSection === 'accounts' && accounts.length > 0 && (
                    <>
                      {accounts.map((account) => (
                        <SectionCard
                          key={account.id}
                          title={account.sourceName}
                          subtitle={`${account.type === 'checking' ? 'Conto Corrente' : 'Conto di Risparmio'} • ${account.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
                          metricValue={account.amount}
                          metricSuffix=" €"
                          trend="up"
                          onEdit={() => alert(`Modifica ${account.sourceName}`)}
                          onDelete={() => alert(`Elimina ${account.sourceName}`)}
                        />
                      ))}
                    </>
                  )}
                  {activeSection === 'investments' && investments.length > 0 && (
                    <>
                      {investments.map((inv) => (
                        <SectionCard
                          key={inv.id}
                          title={inv.sourceName}
                          subtitle={`${inv.type === 'stocks' ? 'Portafoglio Azionario' : 'Fondo Obbligazionario'} • ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
                          metricValue={inv.amount}
                          metricSuffix=" €"
                          trend="up"
                          onEdit={() => alert(`Modifica ${inv.sourceName}`)}
                          onDelete={() => alert(`Elimina ${inv.sourceName}`)}
                        />
                      ))}
                    </>
                  )}
                  {activeSection === 'crypto' && crypto.length > 0 && (
                    <>
                      {crypto.map((c) => (
                        <SectionCard
                          key={c.id}
                          title={c.sourceName}
                          subtitle={`${c.type} • ${
                            // Mock price calculation for display purposes
                            (() => {
                              switch (c.type) {
                                case 'BTC': return (c.amount * 60000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                case 'ETH': return (c.amount * 3000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                default: return (c.amount * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                              }
                            })()
                          } €`}
                          metricValue={c.amount}
                          metricSuffix={c.type === 'BTC' || c.type === 'ETH' ? ' BTC' : c.type === 'ADA' || c.type === 'DOT' || c.type === 'LINK' ? ' ' + c.type : ' unità'}
                          trend="up"
                          onEdit={() => alert(`Modifica ${c.sourceName}`)}
                          onDelete={() => alert(`Elimina ${c.sourceName}`)}
                        />
                      ))}
                    </>
                  )}
                  {(activeSection === 'accounts' && accounts.length === 0) ||
                  (activeSection === 'investments' && investments.length === 0) ||
                  (activeSection === 'crypto' && crypto.length === 0) && (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <p className="text-gray-500 text-lg">Nessuna fonte aggiunta ancora. Clicca su "Aggiungi Fonte" per iniziare.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Modals */}
    {showAddAccountModal && (
      <AddAccount
        onClose={() => setShowAddAccountModal(false)}
        onAccountAdded={fetchAllData}
      />
    )}
    {showAddInvestmentModal && (
      <AddInvestment
        onClose={() => setShowAddInvestmentModal(false)}
        onInvestmentAdded={fetchAllData}
      />
    )}
    {showAddCryptoModal && (
      <AddCrypto
        onClose={() => setShowAddCryptoModal(false)}
        onCryptoAdded={fetchAllData}
      />
    )}
  );
};

export default Dashboard;