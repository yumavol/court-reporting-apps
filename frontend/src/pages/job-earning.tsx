import { Geist } from 'next/font/google';
import cn from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { httpGet } from '@/helper/axios';
import { JobStatusBadge } from '@/models/statuses';
import Link from 'next/dist/client/link';
import { formatMoney } from '@/helper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function Home() {
  const { data: jobs, isLoading } = useQuery<JobResponse[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await httpGet('/jobs', false, {
        status: 'COMPLETED',
      }).then((res) => res.data);
      return response.data;
    },
  });

  return (
    <main className={cn(geistSans.variable, 'min-h-screen bg-base-100 font-sans')}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center">Court Reporting Apps</h1>
        <div className="flex items-center justify-center gap-3 mb-8 pt-4">
          <Link className="link link-primary" href="/">
            Dashboard
          </Link>
          <div className="text-gray-400">Earning Report</div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200 overflow-hidden">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Case Name</th>
                    <th>Status</th>
                    <th>Reporter Fee</th>
                    <th>Editor Fee</th>
                    <th>Total Fee</th>
                    <th>Completed At</th>
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
                      <td>{job.name}</td>
                      <td>
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td>{formatMoney(Number(job.payment?.reporterAmount))}</td>
                      <td>{formatMoney(Number(job.payment?.editorAmount))}</td>
                      <td>{formatMoney(Number(job.payment?.totalAmount))}</td>
                      <td>{new Date(job.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
