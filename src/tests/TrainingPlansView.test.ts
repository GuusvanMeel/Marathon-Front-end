import TrainingPlansView from "@/views/TrainingPlansView.vue"
import { flushPromises, mount } from "@vue/test-utils"

const fakePlans = [
  {
    id: '1',
    marathonName: 'Eindhoven Marathon',
    startDate: '2026-01-01',
    endDate: '2026-04-01',
    status: 'ACTIVE'
  }]

const fakeItems = [
  {
    id: '1',
    date: '2026-01-02',
    targetDistance: 5,
    actualDistance: 5,
    targetTime: '00:30:00',
    actualTime: '00:28:00',
    status: 'COMPLETED'
  }
]

globalThis.fetch = vi.fn((url: string) => {
  // First call → trainingplans
  if (url.includes('/trainingplans')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fakePlans)
    } as Response)
  }

  // Second call → trainingitems
  if (url.includes('/trainingitems')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fakeItems)
    } as Response)
  }

  return Promise.reject('Unknown endpoint')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any

test('fetches and displays plans when button is clicked', async () => {
  const wrapper = mount(TrainingPlansView)

  // Eerst: empty state zichtbaar
  expect(wrapper.text()).toContain('No plans found')

  // Klik knop
  await wrapper.get('.refresh-btn').trigger('click')

  // Wacht op async fetch + render
  await flushPromises()

  // Check dat data nu zichtbaar is
  expect(wrapper.text()).toContain('Eindhoven Marathon')
})
