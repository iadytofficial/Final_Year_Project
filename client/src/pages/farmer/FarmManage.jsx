import { useEffect, useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import AvailabilityEditor from '../../components/availability/AvailabilityEditor'
import ImagesManager from '../images/ImagesManager'

export default function FarmManage(){
  const [farm,setFarm]=useState(null)
  useEffect(()=>{(async()=>{const {data}=await api.get('/farmers/my-farm'); setFarm(data)})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Manage Farm</h1>
        {!farm? <p>Loading...</p> : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Availability</h2>
              <AvailabilityEditor entityType="Farm" entityId={farm.FarmID||farm._id} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Images</h2>
              <ImagesManager entityType="Farm" entityId={farm.FarmID||farm._id} />
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}