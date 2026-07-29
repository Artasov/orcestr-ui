import { Button } from '../Button/Button.js';
import { Flex } from '../Flex/Flex.js';
import { Text } from '../Text/Text.js';
import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';

export function Pagination({
    page,
    pageCount,
    onPageChange,
    testId,
}: {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    testId?: string;
}) {
    const { copy } = useOrcestrUiLocale();
    return (
        <Flex a="c" g={2} testId={testId}>
            <Button
                size={1}
                v="soft"
                disabled={page <= 1}
                testId={testId ? `${testId}-previous` : undefined}
                onClick={() => onPageChange(page - 1)}
            >
                {copy.common.previous}
            </Button>
            <Text fs="13px" testId={testId ? `${testId}-status` : undefined}>
                {page} / {pageCount}
            </Text>
            <Button
                size={1}
                v="soft"
                disabled={page >= pageCount}
                testId={testId ? `${testId}-next` : undefined}
                onClick={() => onPageChange(page + 1)}
            >
                {copy.common.next}
            </Button>
        </Flex>
    );
}
