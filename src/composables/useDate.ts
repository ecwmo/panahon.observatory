import { format } from 'date-fns'

export default (dateTime = new Date()) => {
  const formatDate = (d = dateTime, strFormat: string) => format(d, strFormat)

  return { formatDate }
}
