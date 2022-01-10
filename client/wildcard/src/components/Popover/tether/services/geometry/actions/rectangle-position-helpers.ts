import { Flipping, Position } from '../../../models/tether-models';
import { createRectangle, Rectangle } from '../../../models/geometry/rectangle';

import { POSITION_VARIANTS } from '../constants';

/**
 * Returns all possible positions (top, top-left, left, right, ..etc) based on
 * initial position and flipping settings.
 */
export function getPositions(position: Position, flipping: Flipping): Array<Position> {
	const positions = [position, POSITION_VARIANTS[position].opposite];

	if (flipping == Flipping.all) {
		positions.push(
			Position.topCenter,
			Position.rightMiddle,
			Position.bottomCenter,
			Position.leftMiddle
		);
	}

	return positions;
}

export function getRoundedElement(element: Rectangle): Rectangle {
	return createRectangle(
		Math.floor(element.left),
		Math.floor(element.top),
		Math.floor(element.width),
		Math.floor(element.height),
	);
}

/**
 * Returned bounded (constrained element) element. Returns null in case if element hasn't been
 * constrained during position calculations.
 *
 * @param element - constrained tooltip element
 * @param originalElement - original sized tooltip element
 */
export function getElementBounds(element: Rectangle, originalElement: Rectangle): Rectangle | null {
	if (element.width < originalElement.width || element.height < originalElement.height) {
		return element;
	}

    return null;
}

export function isElementVisible(element: Rectangle): boolean {
	return element.width * element.height >= 1;
}
