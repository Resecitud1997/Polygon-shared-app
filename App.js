import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GelatoRelay } from "@gelatonetwork/relay-sdk";
import { Share2, Wallet, Zap, ShieldCheck, ArrowDownCircle } from 'lucide-react';

const relay = new GelatoRelay();
const CONTRACT_ADDRESS = "TU_CONTRATO_EN_POLYGON"; // Reemplaza tras desplegar

function App() {
  const [account, setAccount] = useState(null);
  const [earnings, setEarnings] = useState("0.0000");
  const [isMining, setIsMining] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Forzar cambio a red Polygon (ChainID 137)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], 
      });
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setIsMining(true);
    }
  };

  // Retiro sin Fee usando Gelato Relay
  const handleGaslessWithdraw = async () => {
    if (!account) return alert("Conecta tu wallet");
    
    try {
      const request = {
        chainId: 137, // Polygon Mainnet
        target: CONTRACT_ADDRESS,
        data: "0x3ccfd60b", // Hash de la función withdraw()
        user: account,
      };

      // Gelato paga el gas por ti (Sponsoring)
      const response = await relay.sponsoredCall(request, "TU_GELATO_API_KEY");
      alert("Retiro procesado GRATIS. ID de tarea: " + response.taskId);
    } catch (err) {
      console.error("Error en el retiro:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-2">
          <Zap className="text-purple-500 fill-purple-500" />
          <h1 className="text-2xl font-black tracking-tighter">POLYGON-GEN</h1>
        </div>
        <button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
          <Wallet size={18} />
          {account ? `${account.substring(0,6)}...` : "Conectar MetaMask"}
        </button>
      </div>

      {/* Main Dashboard */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Saldo Generado</span>
          <ShieldCheck className="text-green-500" size={20} />
        </div>

        <div className="text-center mb-10">
          <h2 className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
            {earnings}
          </h2>
          <p className="text-purple-400 font-bold mt-2">POLYGON (MATIC)</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGaslessWithdraw}
            className="w-full bg-white text-black h-14 rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-zinc-200 transition-all"
          >
            <ArrowDownCircle size={20} /> RETIRAR SIN COMISIÓN
          </button>
          
          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
            <span className="text-zinc-500 text-sm">Estado del Nodo:</span>
            <span className="flex items-center gap-2 text-sm font-bold">
              <span className={`w-2 h-2 rounded-full ${isMining ? 'bg-green-500 animate-ping' : 'bg-red-500'}`}></span>
              {isMining ? 'COMPARTIENDO' : 'INACTIVO'}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-zinc-600 text-sm text-center max-w-xs">
        Tus ganancias se generan automáticamente al compartir tu ancho de banda sobrante con nuestra red descentralizada en Polygon.
      </p>
    </div>
  );
}

export default App;
