export const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('es-SV');
  }
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return dateString;
  }
  return dateString;
};