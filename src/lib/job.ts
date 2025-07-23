import EventEmitter from 'node:events'

const jobs = new Map<string, EventEmitter>()

export const createJob = (jobId: string) => {
  const bus = new EventEmitter()
  jobs.set(jobId, bus)
  return bus
}

export const getJob = (jobId: string) => jobs.get(jobId)

export const removeJob = (jobId: string) => jobs.delete(jobId)
