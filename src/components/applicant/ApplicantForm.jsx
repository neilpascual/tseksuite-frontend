import { useState } from "react"

export default function ApplicantForm() {
    const [formData, setFormData] = useState({fname: "", lname: "", email: ""})

    const onChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
  return (
        <div className='flex flex-col justify-center items-center h-100 border border-[#D1D1D1] rounded-2xl mt-5 shadow-[4px_4px_0px_#000000]'>
           <div className="h-full w-full">
                <div className="px-5 mt-4 mb-3">
                    Applicant Form
                </div>
                <form action="" className="flex flex-col justify-center px-5 gap-2">
                    <label htmlFor="fname">First Name</label>
                    <input 
                        id="fname" 
                        name="fname" 
                        type="text" 
                        value={formData.fname}
                        className='border rounded-sm py-2 px-1' 
                        onChange={(e) => onChange(e)}
                        />

                    <label htmlFor="lname">Last Name</label>
                    <input 
                        id="lname" 
                        name="lname" 
                        type="text" 
                        value={formData.lname}
                        className='border rounded-sm py-2 px-1' 
                        onChange={(e) => onChange(e)}/>

                    <label htmlFor="email">Email</label>
                    <input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={formData.email}
                        className='border rounded-sm py-2 px-1' 
                        onChange={(e) => onChange(e)}/>
                </form>
           </div>
        </div>
  )
}
