import React from 'react'
import CreateDish1 from '../CreateDish1/CreateDish1'
import CreateDish2 from '../CreateDish2/CreateDish2'
import CreateDish3 from '../CreateDish3/CreateDish3'
import CreateDish4 from '../CreateDish4/CreateDish4'

export default function ManageCreatedish() {
  return (
    <div>
      <h2>Package for 10 to 25 people</h2>
      <CreateDish1/>
      <h2>Package for 25 to 50 people</h2>
      <CreateDish2/>
      <h2>Package for 50 to 100 people</h2>
      <CreateDish3/>
      <h2>Package for more then 100 people</h2>
      <CreateDish4/>
    </div>
  )
}
