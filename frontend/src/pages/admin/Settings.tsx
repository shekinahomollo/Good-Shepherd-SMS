import { useState } from 'react'
import AppShell     from '../../components/layout/AppShell'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('school')

  const tabs = [
    { key:'school',    label:'🏫 School Info'        },
    { key:'academic',  label:'📅 Academic Year'      },
    { key:'grades',    label:'📊 Grade Scale'        },
    { key:'subjects',  label:'📚 Subjects'           },
    { key:'users',     label:'👥 User Accounts'      },
  ]

  const GRADE_SCALE = [
    { label:'A+', min:90, max:100, desc:'Excellent'    },
    { label:'A',  min:80, max:89,  desc:'Very Good'    },
    { label:'B+', min:75, max:79,  desc:'Good'         },
    { label:'B',  min:70, max:74,  desc:'Above Average'},
    { label:'C+', min:65, max:69,  desc:'Average'      },
    { label:'C',  min:60, max:64,  desc:'Below Average'},
    { label:'D+', min:55, max:59,  desc:'Pass'         },
    { label:'D',  min:50, max:54,  desc:'Minimum Pass' },
    { label:'E',  min:0,  max:49,  desc:'Fail'         },
  ]

  return (
    <AppShell pageTitle="Settings">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ocean">System Settings</h2>
        <p className="font-body text-sm text-[var(--text-muted)]">Configure your school system</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-display text-sm transition-colors border
              ${activeTab === tab.key
                ? 'bg-ocean text-white border-ocean'
                : 'bg-white text-[var(--text-muted)] border-ocean/20 hover:border-ocean/40'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* School Info */}
      {activeTab === 'school' && (
        <div className="bg-white rounded-sms border border-ocean/10 p-6 space-y-4 max-w-lg">
          <h3 className="font-display text-base font-semibold text-ocean mb-4">School Information</h3>
          {[
            { label:'School Name',    value:'Good Shepherd School',     type:'text'  },
            { label:'Email',          value:'info@goodshepherd.ac.ke',  type:'email' },
            { label:'Phone',          value:'+254 700 000 000',         type:'tel'   },
            { label:'Location',       value:'Nairobi, Kenya',           type:'text'  },
            { label:'Current Term',   value:'Term 2',                   type:'text'  },
            { label:'Academic Year',  value:'2024/2025',                type:'text'  },
          ].map(f => (
            <div key={f.label}>
              <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">{f.label}</label>
              <input type={f.type} defaultValue={f.value}
                className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean" />
            </div>
          ))}
          <button className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
            Save Changes
          </button>
        </div>
      )}

      {/* Grade Scale */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden max-w-2xl">
          <div className="px-6 py-4 border-b border-ocean/8 flex items-center justify-between">
            <span className="font-display text-base font-semibold text-ocean">Grade Scale (Grades 1–6)</span>
            <span className="font-body text-xs text-[var(--text-muted)]">Kindergarten uses descriptive ratings</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-ocean/3 border-b border-ocean/8">
                {['Grade','Min %','Max %','Description'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-display text-xs text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRADE_SCALE.map(g => (
                <tr key={g.label} className="border-b border-ocean/6 last:border-0 hover:bg-ocean/2">
                  <td className="px-5 py-3">
                    <span className={`font-display text-sm font-semibold px-3 py-1 rounded-full
                      ${g.min>=80?'bg-teal/10 text-teal-dark':g.min>=60?'bg-ocean/8 text-ocean':g.min>=50?'bg-gold/15 text-[#7a5f00]':'bg-red-50 text-red-500'}`}>
                      {g.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-[var(--text-body)]">{g.min}%</td>
                  <td className="px-5 py-3 font-body text-sm text-[var(--text-body)]">{g.max}%</td>
                  <td className="px-5 py-3 font-body text-sm text-[var(--text-muted)]">{g.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Academic Year */}
      {activeTab === 'academic' && (
        <div className="bg-white rounded-sms border border-ocean/10 p-6 max-w-lg">
          <h3 className="font-display text-base font-semibold text-ocean mb-4">Academic Calendar</h3>
          {[
            { label:'Academic Year',   value:'2024/2025'   },
            { label:'Term 1 Start',    value:'2025-01-06'  },
            { label:'Term 1 End',      value:'2025-04-04'  },
            { label:'Term 2 Start',    value:'2025-04-28'  },
            { label:'Term 2 End',      value:'2025-07-04'  },
            { label:'Term 3 Start',    value:'2025-08-04'  },
            { label:'Term 3 End',      value:'2025-10-31'  },
          ].map(f => (
            <div key={f.label} className="mb-4">
              <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">{f.label}</label>
              <input type={f.label.includes('Start')||f.label.includes('End') ? 'date':'text'}
                defaultValue={f.value}
                className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean" />
            </div>
          ))}
          <button className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
            Save Calendar
          </button>
        </div>
      )}

      {/* Subjects */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden max-w-2xl">
          <div className="px-6 py-4 border-b border-ocean/8 flex items-center justify-between">
            <span className="font-display text-base font-semibold text-ocean">Subjects by Grade Level</span>
          </div>
          {[
            { grade:'Kindergarten', subjects:['Literacy','Numeracy','Creative Arts','Physical Development','Social Development'] },
            { grade:'Grade 1–3',    subjects:['English','Mathematics','Science','Social Studies','Creative Arts','PE','Religious Education'] },
            { grade:'Grade 4–6',    subjects:['English','Mathematics','Science','Social Studies','Kiswahili','Creative Arts','PE','Religious Education'] },
          ].map(g => (
            <div key={g.grade} className="px-6 py-4 border-b border-ocean/6 last:border-0">
              <div className="font-display text-sm font-semibold text-ocean mb-2">{g.grade}</div>
              <div className="flex flex-wrap gap-2">
                {g.subjects.map(s => (
                  <span key={s} className="px-3 py-1 bg-sky/15 text-ocean border border-sky/30 rounded-full font-body text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-sms border border-ocean/10 p-6 max-w-lg">
          <h3 className="font-display text-base font-semibold text-ocean mb-4">Create User Account</h3>
          <div className="space-y-4">
            {[
              { label:'Full Name',  placeholder:'First and last name', type:'text'     },
              { label:'Email',      placeholder:'user@goodshepherd.ac.ke', type:'email'},
              { label:'Password',   placeholder:'Temporary password',  type:'password' },
            ].map(f => (
              <div key={f.label}>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean" />
              </div>
            ))}
            <div>
              <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Role</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean bg-white">
                <option value="ADMIN">Administrator</option>
                <option value="TEACHER">Teacher</option>
                <option value="PARENT">Parent</option>
              </select>
            </div>
            <button className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors w-full">
              Create Account
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}