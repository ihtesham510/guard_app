import { CommandMenu } from '@/components/dialogs/command-menu'
import { CompanyDialog } from '@/components/dialogs/company'
import { EmployeeDialog } from '@/components/dialogs/employee'
import { ShiftDialog } from '@/components/dialogs/shift'
import { SiteDialog } from '@/components/dialogs/site'
import { useDialogState } from '@/context/dialog-state-context'

export function Dialogs() {
	const { dialogs } = useDialogState()
	return (
		<>
			<CommandMenu />
			<EmployeeDialog open={dialogs.state.employee} onOpenChange={e => dialogs.setState('employee', e)} />
			<CompanyDialog open={dialogs.state.company} onOpenChange={e => dialogs.setState('company', e)} />
			<ShiftDialog open={dialogs.state.shift} onOpenChange={e => dialogs.setState('shift', e)} />
			<SiteDialog open={dialogs.state.site} onOpenChange={e => dialogs.setState('site', e)} />
		</>
	)
}
