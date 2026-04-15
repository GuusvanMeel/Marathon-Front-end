import { mount } from '@vue/test-utils'
import ToolBar from '@/components/ToolBar.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/trainingplans', component: { template: '<div />' } },
    { path: '/marathons', component: { template: '<div />' } },
    { path: '/about', component: { template: '<div />' } },
  ],
})

test('renders all navigation links', async () => {
  const wrapper = mount(ToolBar, {
    global: {
      plugins: [router],
    },
  })

  expect(wrapper.text()).toContain('Home')
  expect(wrapper.text()).toContain('Training Plans')
  expect(wrapper.text()).toContain('Marathons')
  expect(wrapper.text()).toContain('About')
})

test('links have correct routes', () => {
  const wrapper = mount(ToolBar, {
    global: {
      plugins: [router],
    },
  })

  expect(wrapper.get('[data-test="Home-link"]').attributes('href')).toBe('/')
  expect(wrapper.get('[data-test="TrainingPlans-link"]').attributes('href')).toBe('/trainingplans')
  expect(wrapper.get('[data-test="Marathons-link"]').attributes('href')).toBe('/marathons')
  expect(wrapper.get('[data-test="About-link"]').attributes('href')).toBe('/about')
})
test('navigates to trainingplans when clicked', async () => {
  const wrapper = mount(ToolBar, {
    global: {
      plugins: [router],
    },
  })

  await router.isReady()

  const link = wrapper.get('[data-test="Home-link"]');
  await link.trigger('click')

  expect(router.currentRoute.value.path).toBe('/')
})
