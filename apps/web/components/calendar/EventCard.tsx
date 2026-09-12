"use client";

interface EventCardProps {
  event: any;
  onEdit?: (
    event: any
  ) => void;
  onDelete?: (
    id: string
  ) => void;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
}: EventCardProps) {
  return (
    <div
      className="event-card"
      style={{
        borderLeft: `4px solid ${
          event.color ||
          "#2563eb"
        }`,
      }}
    >
      <div>
        <h3>
          {event.name}
        </h3>

        <p>
          {event.eventType}
        </p>

        <span>
          {event.startDate}
          {event.endDate &&
          event.endDate !==
            event.startDate
            ? ` - ${event.endDate}`
            : ""}
        </span>
      </div>

      <div className="event-card-actions">
        {onEdit && (
          <button
            type="button"
            onClick={() =>
              onEdit(event)
            }
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() =>
              onDelete(
                event.id
              )
            }
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}