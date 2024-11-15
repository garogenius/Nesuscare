import { Video, MessageSquare, Users, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Room {
  id: number;
  title: string;
  type: string;
  status: 'Live' | 'Scheduled';
  startTime?: string;
  participants: number;
  maxParticipants: number;
  host: string;
  image: string;
  description: string;
}

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  const handleJoinRoom = () => {
    setIsJoiningRoom(true);
    alert(`Joining the room: ${room.title}`);
  };

  const handleChat = () => {
    setIsChatting(true);
    alert(`Opening chat for room: ${room.title}`);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="grid sm:grid-cols-3 gap-4">
        
        {/* Image Section */}
        <div className="sm:col-span-1">
          <img
            src={room.image}
            alt={room.title}
            className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
          />
        </div>

        {/* Text Content Section */}
        <div className="sm:col-span-2 p-6">
          
          {/* Title and Status */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{room.title}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                room.status === 'Live'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {room.status}
            </span>
          </div>

          {/* Room Type */}
          <span className="mb-4 inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600">
            {room.type}
          </span>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4">{room.description}</p>

          {/* Participants and Time */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {room.participants}/{room.maxParticipants}
            </div>
            {room.startTime && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {room.startTime}
              </div>
            )}
          </div>

          {/* Host Information */}
          <p className="text-sm font-medium text-gray-900">Host</p>
          <p className="text-sm text-gray-600 mb-6">{room.host}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleJoinRoom}
              className="inline-flex items-center rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              <Video className="mr-2 h-4 w-4" />
              Join Room
            </button>
            <button
              onClick={handleChat}
              className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
