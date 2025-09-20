import ACCESS from '../../assets/images/svgs/access.svg';
import CHART from '@/assets/images/svgs/chart.svg';
import EMAIL from '@/assets/images/svgs/email.svg';
import FACEBOOK from '@/assets/images/svgs/facebook.svg';
import FILTER from '@/assets/images/svgs/filter.svg';
import GITHUB from '@/assets/images/svgs/github.svg';
import GOOGLE from '@/assets/images/svgs/google.svg';
import HOME from '@/assets/images/svgs/home.svg';
import INFO from '@/assets/images/svgs/info.svg';
import LOCK from '@/assets/images/svgs/lock.svg';
import LOGS from '@/assets/images/svgs/logs.svg';
import MY_TASKS from '@/assets/images/svgs/my_tasks.svg';
import PROFILE from '../../assets/images/svgs/profile.svg';
import SEARCH from '@/assets/images/svgs/search.svg';
import SORT from '@/assets/images/svgs/sort.svg';
import TEAMS from '@/assets/images/svgs/teams.svg';
import TRASHCAN from '@/assets/images/svgs/trashcan.svg';
import WRENCH from '@/assets/images/svgs/wrench.svg';

type svgProps = {
	iconName: string;
	className?: string;
};

export default function SvgComponent(props: svgProps) {
	let { iconName, className: classes } = props;

	// Converted to uppercase to avoid
	// spelling mistakes
	iconName = iconName.toUpperCase();

	let html;
	classes += " dark:invert"

	/**
	 * This is sorted alphabetically
	 * for easier searching
	 */
	switch (iconName) {
		case 'ACCESS':
			html = <img className={classes} src={ACCESS} alt="" />;
			break;

		case 'CHARTS':
			html = <img className={classes} src={CHART} alt="" />;
			break;

		case 'EMAIL':
			html = <img className={classes} src={EMAIL} alt="" />;
			break;

		case 'FACEBOOK':
			html = <img className={classes} src={FACEBOOK} alt="" />;
			break;

		case 'FILTER':
			html = <img className={classes} src={FILTER} alt="" />;
			break;

		case 'GITHUB':
			html = <img className={classes} src={GITHUB} alt="" />;
			break;

		case 'GOOGLE':
			html = <img className={classes} src={GOOGLE} alt="" />;
			break;

		case 'HOME':
			html = <img className={classes} src={HOME} alt="" />;
			break;

		case 'INFO':
			html = <img className={classes} src={INFO} alt="" />;
			break;

		case 'LOCK':
			html = <img className={classes} src={LOCK} alt="" />;
			break;

		case 'LOGS':
			html = <img className={classes} src={LOGS} alt="" />;
			break;

		case 'MY TASKS':
			html = <img className={classes} src={MY_TASKS} alt="" />;
			break;

		case 'PROFILE':
			html = <img className={classes} src={PROFILE} alt="" />;
			break;

		case 'SEARCH':
			html = <img className={classes} src={SEARCH} alt="" />;
			break;

		case 'SORT':
			html = <img className={classes} src={SORT} alt="" />;
			break;

		case 'TASKS':
			html = <img className={classes} src={MY_TASKS} alt="" />;
			break;

		case 'TEAMS':
			html = <img className={classes} src={TEAMS} alt="" />;
			break;

		case 'TRASHCAN':
			html = <img className={classes} src={TRASHCAN} alt="" />;
			break;

		case 'WRENCH':
			html = <img className={classes} src={WRENCH} alt="" />;
			break;
	}

	return html;
}
