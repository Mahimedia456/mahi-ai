export default function EditorJobStatus({ job }) {
  if (!job) return null;

  return (
    <div className="border border-mahi-accent/20 bg-black/30 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
            Latest Job
          </p>
          <h3 className="mt-2 text-lg font-bold uppercase tracking-[0.14em] text-white">
            {job.tool_type?.replaceAll("_", " ")}
          </h3>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-mahi-accent">
            {job.status}
          </p>

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {job.output_url ? (
              <>
                <a
                  href={job.output_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border border-mahi-accent px-3 py-2 text-xs uppercase tracking-[0.16em] text-mahi-accent"
                >
                  Open Output
                </a>

                <a
                  href={job.output_url}
                  download
                  className="inline-block border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/75"
                >
                  Download
                </a>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {job.error_message ? (
        <p className="mt-4 text-sm text-red-400">{job.error_message}</p>
      ) : null}
    </div>
  );
}