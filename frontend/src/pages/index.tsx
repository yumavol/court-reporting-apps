/* eslint-disable react-hooks/refs */
import { Geist } from 'next/font/google';
import cn from 'classnames';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpGet, httpPatch, httpPost } from '@/helper/axios';
import { useRef, useState } from 'react';
import Modal from '@/components/modal';
import { LOCATION_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/models/locations';
import SimpleReactValidator from 'simple-react-validator';
import { alertToast, formatMoney } from '@/helper';
import { JOB_STATUS, JobStatusBadge, LocationTypeBadge } from '@/models/statuses';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function Home() {
  const [jobFilter, setJobFilter] = useState<{
    status: string | undefined;
    locationType: string | undefined;
  }>({
    status: undefined,
    locationType: undefined,
  });

  console.log('jobFilter', jobFilter);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalManage, setModalManage] = useState(false);
  const [manageData, setManageData] = useState<JobResponse | null>(null);
  const { data: jobs, isLoading } = useQuery<JobResponse[]>({
    queryKey: ['jobs', jobFilter],
    queryFn: async () => {
      const response = await httpGet('/jobs', false, jobFilter).then((res) => res.data);
      return response.data;
    },
  });

  return (
    <main className={cn(geistSans.variable, 'min-h-screen bg-base-100 font-sans')}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center">Court Reporting Apps</h1>
        <div className="flex items-center justify-center gap-3 mb-8 pt-4">
          <div className="text-gray-400">Dashboard</div>
          <Link className="link link-primary" href="/job-earning">
            Earning Report
          </Link>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex-1">
            <div>
              <button
                className={cn('btn btn-sm mr-2 mb-2', jobFilter.status === undefined ? 'btn-primary' : 'btn-outline')}
                onClick={() => setJobFilter({ ...jobFilter, status: undefined })}
              >
                All Status
              </button>
              {Object.values(JOB_STATUS).map((status) => (
                <button
                  key={status.value}
                  className={cn('btn btn-sm mr-2 mb-2', jobFilter.status === status.value ? 'btn-primary' : 'btn-outline')}
                  onClick={() => setJobFilter({ ...jobFilter, status: status.value })}
                >
                  {status.label}
                </button>
              ))}
            </div>
            <div>
              <button
                className={cn('btn btn-sm mr-2 mb-2', jobFilter.locationType === undefined ? 'btn-primary' : 'btn-outline')}
                onClick={() => setJobFilter({ ...jobFilter, locationType: undefined })}
              >
                All Location Types
              </button>
              {Object.values(LOCATION_TYPE_OPTIONS).map((item) => (
                <button
                  key={item.value}
                  className={cn('btn btn-sm mr-2 mb-2', jobFilter.locationType === item.value ? 'btn-primary' : 'btn-outline')}
                  onClick={() => setJobFilter({ ...jobFilter, locationType: item.value })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => setModalCreate(true)}>
              Create Job
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200 overflow-hidden">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
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
                  {jobs?.map((job) => (
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
                        <button
                          className="btn btn-sm btn-outline btn-primary"
                          onClick={() => {
                            setManageData(job);
                            setModalManage(true);
                          }}
                        >
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
      <ManageJob setShowModal={setModalManage} showModal={modalManage} data={manageData} />
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

function ManageJob({
  setShowModal,
  showModal,
  data,
}: {
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  data: JobResponse | null;
}) {
  const [selectedReporter, setSelectedReporter] = useState<string>('');
  const [selectedEditor, setSelectedEditor] = useState<string>('');

  const queryClient = useQueryClient();

  const { data: reporters } = useQuery<ReporterResponse[]>({
    queryKey: ['reporters', data?.city],
    enabled: data?.city !== undefined,
    queryFn: async () => {
      const response = await httpGet('/reporters', false, {
        preferCity: data?.city,
      }).then((res) => res.data.data);
      return response;
    },
  });

  const { data: editors } = useQuery<EditorResponse[]>({
    queryKey: ['editors'],
    enabled: data?.status === 'TRANSCRIBED',
    queryFn: async () => {
      const response = await httpGet('/editors').then((res) => res.data.data);
      return response;
    },
  });

  const { mutate: assignReporter, isPending: isAssigningReporter } = useMutation({
    mutationFn: (payload: { reporterId: string; jobId: string }) =>
      httpPatch(`/jobs/${payload.jobId}/assign`, {
        reporterId: payload.reporterId,
      }),
    onSuccess: () => {
      alertToast('success', 'Reporter assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['reporters'] });
      setSelectedReporter('');
      setShowModal(false);
    },
  });

  const { mutate: assignEditor, isPending: isAssigningEditor } = useMutation({
    mutationFn: (payload: { editorId: string; jobId: string }) =>
      httpPatch(`/jobs/${payload.jobId}/assign`, {
        editorId: payload.editorId,
      }),
    onSuccess: () => {
      alertToast('success', 'Editor assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['editors'] });
      setSelectedEditor('');
      setShowModal(false);
    },
  });

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (payload: { status: string; jobId: string }) =>
      httpPatch(`/jobs/${payload.jobId}/status`, {
        status: payload.status,
      }),
    onSuccess: () => {
      alertToast('success', 'Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setSelectedReporter('');
      setShowModal(false);
    },
  });

  return (
    <Modal setShowModal={setShowModal} showModal={showModal} size="2xl" title={`Manage Job ${data?.name || ''}`}>
      {data && (
        <div className="">
          <Row label="Case Name">{data.name}</Row>
          <Row label="Duration">{data.durationMinutes}</Row>
          <Row label="Location Type">
            <LocationTypeBadge status={data.locationType} />
          </Row>
          <Row label="City">{data.city}</Row>
          {data.reporter?.name && <Row label="Assigned Reporter">{data.reporter.name}</Row>}
          {data.editor?.name && <Row label="Assigned Editor">{data.editor.name}</Row>}
          <Row label="Status">
            <JobStatusBadge status={data.status} />
          </Row>

          {data.status === 'NEW' && (
            <div className="border p-3 border-gray-100 rounded-lg mt-4">
              <div className="font-semibold text-lg mb-4">Assign Reporter</div>

              <div className="flex justify-between gap-2">
                <div className="flex-1">
                  <div className="form-label">Select Reporter</div>
                  <select
                    className="select select-bordered w-full"
                    value={selectedReporter}
                    onChange={(e) => setSelectedReporter(e.target.value)}
                  >
                    <option disabled value="">
                      Select Reporter
                    </option>
                    {reporters?.map((reporter) => (
                      <option key={reporter.id} value={reporter.id} disabled={reporter.available === false}>
                        {data.locationType !== 'REMOTE' && reporter.location === data.city && '***'} {reporter.name} -{' '}
                        {reporter.location} {reporter.available === false && '(Unavailable)'}{' '}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={!selectedReporter || isAssigningReporter}
                  className="btn btn-primary mt-6"
                  onClick={() => assignReporter({ reporterId: selectedReporter, jobId: data?.id })}
                >
                  Assign
                </button>
              </div>
              {data.locationType !== 'REMOTE' && (
                <div className="text-xs text-gray-500 pt-4">*** Preferred because reporter is in the same city</div>
              )}
            </div>
          )}

          {data.status === 'ASSIGNED' && (
            <div className="border p-3 border-gray-100 rounded-lg mt-4">
              <div className="font-semibold text-lg mb-4">Reporter {data.reporter?.name} assigned</div>
              <button
                className="btn btn-primary"
                onClick={() => updateStatus({ status: 'TRANSCRIBED', jobId: data.id })}
                disabled={isUpdatingStatus}
              >
                Mark as Transcribed
              </button>
            </div>
          )}

          {data.status === 'TRANSCRIBED' && !data.editorId && (
            <div className="border p-3 border-gray-100 rounded-lg mt-4">
              <div className="font-semibold text-lg mb-4">Assign Editor</div>
              <div className="flex justify-between gap-2">
                <div className="flex-1">
                  <div className="form-label">Select Editor</div>
                  <select
                    className="select select-bordered w-full"
                    value={selectedEditor}
                    onChange={(e) => setSelectedEditor(e.target.value)}
                  >
                    <option disabled value="">
                      Select Editor
                    </option>
                    {editors?.map((editor) => (
                      <option key={editor.id} value={editor.id}>
                        {editor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={!selectedEditor || isAssigningEditor}
                  className="btn btn-primary mt-6"
                  onClick={() => assignEditor({ editorId: selectedEditor, jobId: data.id })}
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          {data.status === 'TRANSCRIBED' && data.editorId && (
            <div className="border p-3 border-gray-100 rounded-lg mt-4">
              <div className="font-semibold text-lg mb-4">Editor {data.editor?.name} assigned</div>
              <button
                className="btn btn-primary"
                onClick={() => updateStatus({ status: 'REVIEWED', jobId: data.id })}
                disabled={isUpdatingStatus}
              >
                Mark as Reviewed
              </button>
            </div>
          )}

          {data.status === 'REVIEWED' && <PaymentCard jobId={data.id} setModal={setShowModal} />}
          {data.status === 'COMPLETED' && data.payment && (
            <div className="border p-3 border-gray-100 rounded-lg mt-4">
              <div className="font-semibold text-lg mb-4">Payment Details</div>
              <Row label="Payment ID">{data.payment.id}</Row>
              <Row label="Reporter Amount">{formatMoney(Number(data.payment.reporterAmount))}</Row>
              <Row label="Editor Amount">{formatMoney(Number(data.payment.editorAmount))}</Row>
              <Row label="Total Amount">{formatMoney(Number(data.payment.totalAmount))}</Row>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function PaymentCard({ jobId, setModal }: { jobId: string; setModal: (visible: boolean) => void }) {
  const [, rerender] = useState(0);
  const [reporterRate, setReporterRate] = useState('2000');
  const [editorFee, setEditorFee] = useState('50000');
  const [paymentPreview, setPaymentPreview] = useState<PaymentCalculateResponse | null>(null);

  const validator = useRef(new SimpleReactValidator());

  const queryClient = useQueryClient();

  const { mutate: calculatePayment, isPending: isCalculatingPayment } = useMutation({
    mutationFn: (payload: { jobId: string; reporterRatePerMinute: number; editorFlatFee: number }) =>
      httpPost('/payments/calculate', payload).then((res) => res.data.data),
    onSuccess: (data) => {
      setPaymentPreview(data);
    },
  });

  const { mutate: processPayment, isPending: isProcessingPayment } = useMutation({
    mutationFn: (payload: { jobId: string; reporterRatePerMinute: number; editorFlatFee: number }) =>
      httpPost('/payments', payload).then((res) => res.data.data),
    onSuccess: () => {
      alertToast('success', 'Payment processed successfully');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setPaymentPreview(null);
      setModal(false);
    },
  });

  const performPreview = () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      rerender((prev) => prev + 1);
      alertToast('error', 'Please fill in all required fields');
      return;
    }

    calculatePayment({
      jobId,
      reporterRatePerMinute: parseFloat(reporterRate),
      editorFlatFee: parseFloat(editorFee),
    });
  };

  const performPayment = () => {
    if (!paymentPreview) return;

    processPayment({
      jobId,
      reporterRatePerMinute: parseFloat(reporterRate),
      editorFlatFee: parseFloat(editorFee),
    });
  };

  const validate = {
    reporterRate: validator.current.message('reporterRate', reporterRate, 'required|numeric', validateConfig),
    editorFee: validator.current.message('editorFee', editorFee, 'required|numeric', validateConfig),
  };

  return (
    <div className="border p-3 border-gray-100 rounded-lg mt-4">
      <div className="font-semibold text-lg mb-4">Job is reviewed, ready for payment</div>

      {!paymentPreview && (
        <div className="">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="form-label">Reporter Rate (per minute)</div>
              <label className={cn('input input-bordered w-full', validate.reporterRate && 'input-error')}>
                <input
                  placeholder="Reporter Rate (per minute)"
                  value={reporterRate}
                  onChange={(e) => setReporterRate(e.target.value)}
                />{' '}
                <label className="badge badge-primary badge-xs rounded-sm">IDR</label>
              </label>
              {validate.reporterRate}
            </div>

            <div>
              <div className="form-label">Editor Flat Fee</div>
              <label className={cn('input input-bordered w-full', validate.editorFee && 'input-error')}>
                <input placeholder="Editor Flat Fee" value={editorFee} onChange={(e) => setEditorFee(e.target.value)} />
                <label className="badge badge-primary badge-xs rounded-sm">IDR</label>
              </label>
              {validate.editorFee}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button className="btn btn-primary" onClick={() => performPreview()} disabled={isCalculatingPayment}>
              Calculate Payment
            </button>
          </div>
        </div>
      )}

      {paymentPreview && (
        <div className="">
          <div className="bg-gray-50 p-3 rounded-lg mt-4">
            <div className="font-semibold mb-2">Payment Preview</div>
            <div>Case Name: {paymentPreview.caseName}</div>
            <div>Duration: {paymentPreview.durationMinutes} minutes</div>
            <div>Reporter Amount: {formatMoney(paymentPreview.reporterAmount)}</div>
            <div>Editor Amount: {formatMoney(paymentPreview.editorAmount)}</div>
            <div>Total Amount: {formatMoney(paymentPreview.totalAmount)}</div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button className="btn btn-accent" onClick={() => setPaymentPreview(null)} disabled={isCalculatingPayment}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => performPayment()} disabled={isProcessingPayment}>
              Process Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const validateConfig = { className: 'text-red-500 text-sm' };

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="leading-tight flex justify-between items-center border-b border-gray-100 py-2">
    <div className="text-sm text-gray-700">{label}</div>
    <div className="font-semibold">{children}</div>
  </div>
);
