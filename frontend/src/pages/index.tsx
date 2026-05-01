/* eslint-disable react-hooks/refs */
import { Geist, Geist_Mono } from 'next/font/google';
import cn from 'classnames';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpGet, httpPost } from '@/helper/axios';
import { useRef, useState } from 'react';
import Modal from '@/components/modal';
import { LOCATION_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/models/locations';
import SimpleReactValidator from 'simple-react-validator';
import { alertToast } from '@/helper';
import { JobStatusBadge, LocationTypeBadge } from '@/models/statuses';

interface JobResponse {
  id: string;
  name: string;
  durationMinutes: number;
  locationType: string;
  city: string | null;
  status: string;
  createdAt: string;
  reporterId: string | null;
  editorId: string | null;
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const [modalCreate, setModalCreate] = useState(false);
  const { data: jobs, isLoading } = useQuery<JobResponse[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await httpGet('/jobs').then((res) => res.data);
      return response.data;
    },
  });

  console.log(jobs);
  return (
    <main className={cn(geistSans.variable, geistMono.variable, 'min-h-screen bg-base-100 font-sans')}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">Court Reporting Apps</h1>

        <div className="flex justify-end mb-4">
          <button className="btn btn-primary" onClick={() => setModalCreate(true)}>
            Create Job
          </button>
        </div>

        <div className="card bg-base-100 shadow border border-base-200 overflow-hidden">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Case Name</th>
                    <th>Duration (min)</th>
                    <th>Location Type</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <span className="loading loading-spinner loading-md" />
                      </td>
                    </tr>
                  )}
                  {!isLoading && (!jobs || jobs.length === 0) && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-base-content/50">
                        No jobs found. Create one to get started.
                      </td>
                    </tr>
                  )}
                  {jobs?.map((job, index) => (
                    <tr key={job.id}>
                      <td className="font-medium">{job.name}</td>
                      <td>{String(job.durationMinutes)}</td>
                      <td>
                        <LocationTypeBadge status={job.locationType} />
                      </td>
                      <td>{job.city ?? '—'}</td>
                      <td>
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline btn-primary" disabled={job.status !== 'NEW'}>
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateJob setShowModal={setModalCreate} showModal={modalCreate} />
    </main>
  );
}

function CreateJob({ setShowModal, showModal }: { setShowModal: (show: boolean) => void; showModal: boolean }) {
  const [, rerender] = useState(0);
  const validator = useRef(new SimpleReactValidator());
  const queryClient = useQueryClient();

  const [caseName, setCaseName] = useState('');
  const [duration, setDuration] = useState('');
  const [locationType, setLocationType] = useState('');
  const [city, setCity] = useState('');

  const { mutate: createJob, isPending } = useMutation({
    mutationFn: (payload: { caseName: string; durationMinutes: number; locationType: string; city: string }) =>
      httpPost('/jobs', payload),
    onSuccess: () => {
      alertToast('success', 'Job created successfully');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowModal(false);
      setCaseName('');
      setDuration('');
      setLocationType('');
      setCity('');
      validator.current.hideMessages();
    },
  });

  const performSubmit = () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      rerender((prev) => prev + 1);
      alertToast('error', 'Please fill in all required fields');
      return;
    }

    createJob({
      caseName,
      durationMinutes: Number(duration),
      locationType,
      city,
    });
  };

  const validateConfig = { className: 'text-red-500 text-sm' };

  const validate = {
    caseName: validator.current.message('caseName', caseName, 'required', validateConfig),
    duration: validator.current.message('duration', duration, 'required|numeric', validateConfig),
    city: validator.current.message('city', city, 'required', validateConfig),
    locationType: validator.current.message('type', locationType, 'required', validateConfig),
  };

  return (
    <Modal setShowModal={setShowModal} showModal={showModal} size="md" title="Create Job">
      <div className="flex flex-col gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            performSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <div className="form-label">Case name</div>
            <input
              type="text"
              placeholder="Case Name"
              className={cn('input input-bordered w-full', validate.caseName && 'input-error')}
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
            />
            {validate.caseName}
          </div>

          <div>
            <div className="form-label">Duration (minutes)</div>
            <input
              placeholder="Duration (minutes)"
              className={cn('input input-bordered w-full', validate.duration && 'input-error')}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            {validate.duration}
          </div>

          <div>
            <div className="form-label">Location</div>
            <select
              className={cn('select select-bordered w-full', validate.locationType && 'input-error')}
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <option disabled value="">
                Select Location
              </option>
              {LOCATION_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validate.locationType}
          </div>

          <div>
            <div className="form-label">City</div>
            <select
              className={cn('select select-bordered w-full', validate.city && 'input-error')}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option disabled value="">
                Select City
              </option>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validate.city}
          </div>

          <div className="w-full pt-4">
            <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
              {isPending ? <span className="loading loading-spinner loading-sm" /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
