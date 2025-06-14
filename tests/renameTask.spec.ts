import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ActiveTaskDisplay from '../src/components/ActiveTaskDisplay.vue'

describe('ActiveTaskDisplay rename', () => {
  it('emits rename when edited name is submitted with Enter', async () => {
    const wrapper = mount(ActiveTaskDisplay, {
      props: {
        taskName: 'Old Task',
        elapsedSeconds: 0
      }
    })

    await wrapper.get('.active-task-name span').trigger('click')
    const input = wrapper.get('input.rename-input')
    await input.setValue('New Task')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('rename')).toBeTruthy()
    expect(wrapper.emitted('rename')![0]).toEqual(['New Task'])
  })
})
