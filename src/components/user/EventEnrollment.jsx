import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { getAllEvents, addParticipantToEvent, removeParticipantFromEvent } from '../../services/eventService';
import { formatDate } from '../../utils/formatters';

const EventEnrollment = ({ capelaoCustomId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingEventId, setProcessingEventId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const result = await getAllEvents();
      if (result.success) {
        // Filtra apenas eventos ativos
        const activeEvents = result.data.filter(event => event.isActive);
        setEvents(activeEvents);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (eventId) => {
    setProcessingEventId(eventId);
    try {
      const result = await addParticipantToEvent(eventId, capelaoCustomId);
      if (result.success) {
        alert('Inscrição realizada com sucesso!');
        loadEvents(); // Recarrega para atualizar status
      } else {
        alert(result.error || 'Erro ao realizar inscrição');
      }
    } catch (error) {
      console.error('Erro ao inscrever:', error);
      alert('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleUnenroll = async (eventId) => {
    if (!confirm('Deseja realmente cancelar sua inscrição neste evento?')) {
      return;
    }

    setProcessingEventId(eventId);
    try {
      const result = await removeParticipantFromEvent(eventId, capelaoCustomId);
      if (result.success) {
        alert('Inscrição cancelada com sucesso!');
        loadEvents(); // Recarrega para atualizar status
      } else {
        alert(result.error || 'Erro ao cancelar inscrição');
      }
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      alert('Erro ao cancelar inscrição. Tente novamente.');
    } finally {
      setProcessingEventId(null);
    }
  };

  const isEnrolled = (event) => {
    return event.participants && event.participants.includes(capelaoCustomId);
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">Nenhum evento disponível no momento</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Eventos e Cursos Disponíveis
      </h3>
      
      {events.map(event => {
        const enrolled = isEnrolled(event);
        const participantCount = event.participants ? event.participants.length : 0;

        return (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {event.name}
                  </h4>
                  {enrolled && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <CheckCircle className="h-3 w-3" />
                      Inscrito
                    </span>
                  )}
                </div>

                {event.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(event.startDate)}
                      {event.endDate && ` - ${formatDate(event.endDate)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{participantCount} participante{participantCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="ml-4">
                {enrolled ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUnenroll(event.id)}
                    disabled={processingEventId === event.id}
                    isLoading={processingEventId === event.id}
                  >
                    Cancelar Inscrição
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleEnroll(event.id)}
                    disabled={processingEventId === event.id}
                    isLoading={processingEventId === event.id}
                  >
                    Inscrever-se
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EventEnrollment;
