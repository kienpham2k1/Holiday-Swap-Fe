import React from 'react'
import CreatePropertyType from './CreatePropertyType'
import requireAuth from '@/app/libs/requireAuth'

export const metadata = {
  title: 'Create Property Type',
};

export default function CreatePropertyTypePage() {
  return requireAuth(<CreatePropertyType />, [3])
}
