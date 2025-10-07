import { useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import ProgressIndicator from '../../components/wizard/ProgressIndicator'
import StepNavigation from '../../components/wizard/StepNavigation'
import Step1BasicInfo from './FarmRegistrationWizard/Step1BasicInfo'
import Step2FarmDetails from './FarmRegistrationWizard/Step2FarmDetails'
import Step3Activities from './FarmRegistrationWizard/Step3Activities'
import Step4Gallery from './FarmRegistrationWizard/Step4Gallery'
import Step5Review from './FarmRegistrationWizard/Step5Review'
import api from '../../services/api'
import { toast } from 'react-toastify'

const steps = ['Basic Info','Farm Details','Activities','Gallery','Review']

export default function FarmRegistration() {
  const [current, setCurrent] = useState(0)
  const [form, setForm] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const next = async (payload) => {
    const merged = { ...form }
    if (current === 0) merged.basic = payload
    if (current === 1) merged.details = payload
    if (current === 2) merged.activities = payload
    if (current === 3) merged.images = payload
    setForm(merged)

    if (current < steps.length - 1) setCurrent((c) => c + 1)
    else await submitAll(merged)
  }

  const back = () => setCurrent((c) => Math.max(0, c - 1))

  const submitAll = async (data) => {
    setSubmitting(true)
    try {
      const facilities = (data?.details?.FacilitiesCsv || '')
        .split(',').map((s) => s.trim()).filter(Boolean)

      const payload = {
        ...data.basic,
        Description: data?.basic?.Description?.slice(0, 1000) || '',
        FarmType: data?.basic?.FarmType || '',
        Location: data?.details?.Location || {},
        Facilities: facilities,
      }
      const { data: farm } = await api.post('/farmers/register-farm', payload)

      // Upload images if any
      if (data.images?.length) {
        const formData = new FormData()
        for (const f of data.images) formData.append('images', f)
        await api.post('/farmers/upload-farm-images', formData)
      }

      // Optionally create activities
      if (Array.isArray(data.activities) && data.activities.length) {
        for (const a of data.activities) {
          await api.post('/activities/create', {
            FarmID: farm.FarmID || farm._id,
            CustomTitle: a.CustomTitle,
            PricePerPerson: a.PricePerPerson,
            Status: 'Active',
          })
        }
      }

      toast.success('Farm registered successfully')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to register farm')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Register Your Farm</h1>
        <ProgressIndicator current={current} total={steps.length} />
        <div className="mt-4 rounded border bg-white p-4">
          {current === 0 && <Step1BasicInfo defaultValues={form.basic} onSubmit={next} />}
          {current === 1 && <Step2FarmDetails defaultValues={form.details} onSubmit={next} />}
          {current === 2 && <Step3Activities defaultValues={form.activities} onSubmit={next} />}
          {current === 3 && <Step4Gallery defaultValues={form.images} onSubmit={next} />}
          {current === 4 && <Step5Review data={form} />}
          <StepNavigation onBack={back} onNext={() => {}}
            nextDisabled={submitting}
            nextLabel={current === steps.length - 1 ? 'Submit' : 'Next'}
          />
        </div>
        <div className="mt-2 text-right">
          <button onClick={() => next(form[current])} disabled={submitting} className="rounded bg-brand px-4 py-2 text-white">
            {current === steps.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </ProtectedLayout>
  )
}
