import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface OrganizerLinkProps {
  // CHANGED: added organizerId — routes to /organizer/{id} instead of a name-based slug
  organizerId?: number | string | null;
  organizerName: string;
  className?: string;
  children?: React.ReactNode;
}

const OrganizerLink = ({ organizerId, organizerName, className = "", children }: OrganizerLinkProps) => {
  const { user } = useAuth();

  // CHANGED: use numeric id for routing if available, fall back to name slug only as last resort
  const href = organizerId
    ? `/organizer/${organizerId}`
    : `/organizer/${organizerName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      // CHANGED: redirect uses the same resolved href so the return URL is always correct
      window.location.href = `/login?redirect=${href}`;
    }
  };

  return (
    <Link to={href} className={className} onClick={handleClick}>
      {children || organizerName}
    </Link>
  );
};

export default OrganizerLink;