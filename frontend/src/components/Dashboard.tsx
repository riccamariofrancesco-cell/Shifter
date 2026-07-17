import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import SectionCard from './SectionCard';
import './Dashboard.css'; // We'll create this for any additional styles

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'accounts' | 'investments' | 'crypto' | 'account'>('accounts');
  const [accounts, setAccounts] = useState<Array<{ id: number; sourceName: string; type: string; amount: number }>>([]);
  const [investments, setInvestments] = useState<Array<{ id: number; sourceName: string; type: string; amount: number }>>([]);
  const [crypto, setCrypto] = useState<Array<{ id: number; sourceName: string; type: string; amount: number }>>([]);

  // Mock data fetching - in real app, use useWealth hook
  useEffect(() => {
    // Simulate fetching user's assets
    setAccounts([
      { id: 1, sourceName: 'Conto Intesa', type: 'checking', amount: 5420.00 },
      { id: 2, sourceName: 'Conto Revolut', type: 'savings', amount: 1250.50 },
    ]);
    setInvestments([
      { id: 1, sourceName: 'Portfolio Azionario', type: 'stocks', amount: 15420.75 },
      { id: 2, sourceName: 'Fondo Obbligazionario', type: 'bonds', amount: 8200.00 },
    ]);
    setCrypto([
      { id: 1, sourceName: 'Wallet Bitcoin', type: 'BTC', amount: 0.12 },
      { id: 2, sourceName: 'Wallet Ethereum', type: 'ETH', amount: 2.5 },
    ]);
  }, []);

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
              })()}
            </h1>
            <p className="mt-1 text-gray-600">
              Panoramica del tuo patrimonio totale: <span className="font-semibold text-lg">€{totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
          </div>

          {/* Section Content */}
          <div className="space-y-6">
            {activeSection === 'account' ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Impostazioni Account</h2>
                <p className="text-gray-600">Qui puoi modificare le tue informazioni personali, cambiare password e configurare la sicurezza.</p>
                {/* In a real app, you would have a form here */}
              </div>
            ) : (
              <>
                {/* Action Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => alert(`Aggiungi nuova fonte per ${activeSection}`)}
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
                          subtitle={`${c.type} • ${(c.amount * 30000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`} // Mock BTC price
                          metricValue={c.amount}
                          metricSuffix=" BTC"
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
  );
};

export default Dashboard;