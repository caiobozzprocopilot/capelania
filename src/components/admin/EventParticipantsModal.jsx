import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getCapelao } from '../../services/capelaoService';
import { Users, Mail, Phone, MapPin, Church, Calendar } from 'lucide-react';
import { formatCPF, formatPhone, formatDate } from '../../utils/formatters';
import Card from '../common/Card';

const EventParticipantsModal = ({ isOpen, onClose, event }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && event) {
      loadParticipants();
    }
  }, [isOpen, event]);

  const loadParticipants = async () => {
    if (!event || !event.participants || event.participants.length === 0) {
      setParticipants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const participantsData = [];
      
      for (const customId of event.participants) {
        const result = await getCapelao(customId);
        if (result.success) {
          participantsData.push(result.data);
        }
      }

      setParticipants(participantsData);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={event.name}
      size="large"
    >
      {/* Informações do Evento */}
      <div className="mb-6 p-5 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Local</span>
            <span className="text-base font-semibold text-gray-900">{event.location}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Data de Início</span>
            <span className="text-base font-semibold text-gray-900">{formatDate(event.startDate)}</span>
          </div>
          {event.endDate && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Data de Término</span>
              <span className="text-base font-semibold text-gray-900">{formatDate(event.endDate)}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total de Participantes</span>
            <span className="text-2xl font-bold text-primary-600">
              {event.participants ? event.participants.length : 0}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">Nenhum participante inscrito ainda</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista de Participantes ({participants.length})
            </h3>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {participants.map((participante, index) => (
              <div 
                key={participante.customId}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Número do Participante */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  {/* Informações do Participante */}
                  <div className="flex-1 min-w-0">
                    {/* Nome e Igreja */}
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {participante.nomeCompleto}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Church className="w-4 h-4 flex-shrink-0 text-primary-500" />
                        <span className="font-medium text-sm">{participante.igreja}</span>
                      </div>
                    </div>

                    {/* Grid de Informações */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Coluna 1: Contato */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Contato
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0 text-gray-400 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate" title={participante.email}>
                              {participante.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span className="text-sm text-gray-900 font-medium">
                            {formatPhone(participante.telefone)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-500">CPF:</span>
                          <span className="text-sm text-gray-900 font-mono">
                            {formatCPF(participante.cpf)}
                          </span>
                        </div>
                      </div>

                      {/* Coluna 2: Dados Eclesiásticos */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Dados Eclesiásticos
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-500">Cargo:</span>
                          <span className="text-sm text-gray-900 font-medium">
                            {participante.cargoEclesiastico}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {participante.cidadeAtual}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {participante.idade} anos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default EventParticipantsModal;
