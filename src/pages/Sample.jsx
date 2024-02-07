import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Table from '../components/Table'


const Sample = () => {
  return (
    <div>
      <div >
        <NavBar></NavBar>
      </div>
      <div className='flex h-screen'>
        <div className='box-border hidden border-2 md:block w-96'>
          <SideBar></SideBar>
        </div>
        <div className='w-screen p-10 ' >
          {/* Enter components here, that you want to insert. */}
          {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi saepe iusto pariatur placeat praesentium sunt quia aut, assumenda minus dignissimos officiis, nostrum optio quasi culpa doloremque hic molestias, ab ullam. Culpa laborum veritatis veniam laboriosam perferendis in a repudiandae nihil, reprehenderit ratione ex itaque maiores suscipit, tempore dolorum ad aperiam nam praesentium magnam iure aut saepe animi. Quidem adipisci, animi, neque dolor sequi eaque, quisquam iste placeat minima quae suscipit mollitia voluptates accusamus excepturi. Totam praesentium sit magni corrupti animi quasi quibusdam exercitationem vel nisi cupiditate tempora, perspiciatis deleniti quas, explicabo non dolorem odio harum soluta unde. Ex, voluptas beatae. */}
          <h1 className="p-4 text-3xl font-bold">User</h1>
          <Table></Table>
        </div>
      </div>
    </div>
  )
}

export default Sample
