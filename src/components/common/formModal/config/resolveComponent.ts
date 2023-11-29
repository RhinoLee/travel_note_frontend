import TextInput from '@/components/common/FormItem/TextInput.vue'
import PureText from '@/components/common/FormItem/PureText.vue'
import DateInput from '@/components/common/FormItem/DateInput.vue'
import TimeInput from '@/components/common/FormItem/TimeInput.vue'
import AvatarInput from '@/components/common/FormItem/AvatarInput.vue'
import SingleFileInput from '@/components/common/FormItem/SingleFileInput.vue'

export function resolveComponent(type: string) {
  if (type === 'text') return TextInput
  if (type === 'pureText') return PureText
  if (type === 'date') return DateInput
  if (type === 'time') return TimeInput
  if (type === 'avatar') return AvatarInput
  if (type === 'singleFile') return SingleFileInput
}
