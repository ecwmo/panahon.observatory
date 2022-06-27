import { format, isValid } from 'date-fns'

export default (dateTime = new Date()) => {
  const formatDate = (strFormat: string, d = dateTime) =>
    isValid(d) ? format(d, strFormat) : format(new Date(), strFormat)

  return { formatDate }
}
