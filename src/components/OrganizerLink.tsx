import { Link } from "react-router-dom";
import { organizerSlug } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface OrganizerLinkProps {
  organizerName: string;
  className?: string;
  children?: React.ReactNode;
}

const OrganizerLink = ({ organizerName, className = "", children }: OrganizerLinkProps) => {
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      // Redirect to auth with return URL
      window.location.href = `/auth?redirect=/organizer/${organizerSlug(organizerName)}`;
    }
  };

  return (
    <Link
      to={`/organizer/${organizerSlug(organizerName)}`}
      className={className}
      onClick={handleClick}
    >
      {children || organizerName}
    </Link>
  );
};

export default OrganizerLink;