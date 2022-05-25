import { format } from 'date-fns'

export default (dateTime = new Date()) => {
  const formatDate = (strFormat: string, d = dateTime) => format(d, strFormat)

  return { formatDate }
}
