import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { expenseService } from '../services/expenseService'
import type { Category, Expense } from '../types/expense'

export function ExpensesPage() {
  const [rows, setRows] = useState<Expense[]>([])
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [showExport, setShowExport] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exportCategoryId, setExportCategoryId] = useState<string>('')
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => expenseService.list(search).then(setRows), 200)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    expenseService.categories().then(setCategories)
  }, [])

  // Close panel when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowExport(false)
      }
    }
    if (showExport) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [showExport])

  async function handleExport() {
    setExporting(true)
    setExportError(null)
    try {
      await expenseService.exportCsv({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        category_id: exportCategoryId ? Number(exportCategoryId) : undefined,
      })
      setShowExport(false)
    } catch {
      setExportError('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-slate-600">Review and manage recorded expenses.</p>
        </div>
        <div className="flex items-center gap-2" ref={panelRef} style={{ position: 'relative' }}>
          {/* Export panel */}
          {showExport && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1rem',
                minWidth: '260px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                zIndex: 50,
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Export CSV</p>
              <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                From
              </label>
              <input
                id="export-start-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="field"
                style={{ marginBottom: '0.5rem', width: '100%' }}
              />
              <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                To
              </label>
              <input
                id="export-end-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="field"
                style={{ marginBottom: '0.5rem', width: '100%' }}
              />
              <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                Category (optional)
              </label>
              <select
                id="export-category"
                value={exportCategoryId}
                onChange={e => setExportCategoryId(e.target.value)}
                className="field"
                style={{ marginBottom: '0.75rem', width: '100%' }}
              >
                <option value="">All categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {exportError && (
                <p style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{exportError}</p>
              )}
              <button
                id="export-download-btn"
                className="btn"
                style={{ width: '100%' }}
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? 'Downloading…' : 'Download CSV'}
              </button>
            </div>
          )}
          <button
            id="export-csv-btn"
            onClick={() => setShowExport(v => !v)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #cbd5e1',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#334155',
            }}
          >
            ⬇ Export CSV
          </button>
          <Link className="btn" to="/expenses/new">Add expense</Link>
        </div>
      </div>
      <input
        aria-label="Search expenses"
        className="field mb-4 max-w-sm"
        placeholder="Search supplier or description"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Date', 'Supplier', 'Category', 'Description', 'GST', 'Total', 'Status'].map(h => (
                <th className="p-3" key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(x => (
              <tr className="border-t" key={x.id}>
                <td className="p-3">
                  <Link className="text-teal-700 hover:underline" to={`/expenses/${x.id}`}>{x.invoice_date}</Link>
                </td>
                <td>{x.supplier_name}</td>
                <td>{x.category_name}</td>
                <td>{x.description}</td>
                <td>${x.gst_amount}</td>
                <td>${x.total_amount}</td>
                <td>{x.ocr_confirmed ? 'Confirmed' : 'Draft'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-slate-500">No expenses found.</p>}
      </div>
    </>
  )
}
