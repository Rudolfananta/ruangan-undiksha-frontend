import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UserLayout } from '@/components/layouts/UserLayout';
import { RoleProtector } from '@/components/role-protector';
import useSWR from 'swr';
import { apiServiceFetcher } from '@/lib/apiService';
import { Badge } from '@/components/ui/badge';
import { isoToHuman } from '@/lib/format';
import { DataBlank } from '@/components/data-fallback';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserDashboardPage() {
    const { data, isLoading } = useSWR('/room-requests', apiServiceFetcher);

    return (
        <RoleProtector role="user">
            <UserLayout>
                {
                    !data || isLoading
                        ? <Skeleton className="w-full h-[300px]" />
                        : data.length > 0
                            ? <BookingList bookings={data} />
                            : <DataBlank />
                }
            </UserLayout>
        </RoleProtector>
    );
}

function BookingList({ bookings }: { bookings: any }) {
    return (
        <Table>
            <TableCaption>Daftar booking ruangan anda.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Ruangan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    bookings.map((booking: any) => {
                        return (
                            <TableRow>
                                <TableCell className="font-medium">{booking.id}</TableCell>
                                <TableCell>{booking.unit.name}</TableCell>
                                <TableCell>{booking.room.name}</TableCell>
                                <TableCell className="truncate">{isoToHuman(booking.date)} ({booking.time_start}-{booking.time_end})</TableCell>
                                <TableCell><Badge variant="outline">{booking.status}</Badge></TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>
    );
}