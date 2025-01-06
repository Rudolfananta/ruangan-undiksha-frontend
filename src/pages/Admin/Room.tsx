import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { RoleProtector } from '@/components/role-protector';
import useSWR, { mutate } from 'swr';
import apiService, { apiServiceFetcher } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { DeleteIcon, EditIcon, PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { DataBlank } from '@/components/data-fallback';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
    name: z.string()
                .min(1, 'Minimal 1 karakter')
                .max(200, 'Maksimal 200 karakter')
});

export default function RoomPage() {
    const { data, isLoading } = useSWR('/rooms', apiServiceFetcher);

    return (
        <RoleProtector role="admin">
            <AdminLayout>
                <div className="flex justify-end my-4">
                    <CreateRoomOverlay />
                </div>
                {
                    !data || isLoading
                        ? <Skeleton className="w-full h-[300px]" />
                        : data.length > 0
                            ? <RoomList rooms={data} />
                            : <DataBlank />
                }
            </AdminLayout>
        </RoleProtector>
    );
}

function CreateRoomOverlay() {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    });

    const handleStore = useCallback((values: z.infer<typeof formSchema>) => {
        apiService()
            .post(`/rooms`, values)
            .then(() => {
                toast({
                    title: 'Ruangan berhasil dibuat'
                });
            })
            .catch(() => {
                toast({
                    title: 'Ruangan gagal dibuat'
                });
            })
            .finally(() => {
                form.reset();
                mutate('/rooms');
                setDialogOpen(false);
            });
    }, []);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <Button variant="outline">
                    <PlusIcon />
                    Tambahkan Ruangan
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambahkan Ruangan</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleStore)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama ruangan</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Masukkan nama ruangan"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant="secondary">Batal</Button>
                            </DialogClose>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function RoomList({ rooms }: { rooms: any }) {
    return (
        <Table>
            <TableCaption>Daftar ruangan anda.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>&nbsp;</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    rooms.map((room: any) => {
                        return (
                            <DataRow key={room.id} room={room} />
                        );
                    })
                }
            </TableBody>
        </Table>
    );
}

function DataRow({ room }: { room: any }) {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: room.name
        }
    });

    const deleteData = useCallback((id: number) => {
        apiService()
            .delete(`/rooms/${id}`)
            .then(() => {
                toast({
                    title: 'Ruangan berhasil dihapus'
                });
            })
            .catch(() => {
                toast({
                    title: 'Ruangan gagal dihapus'
                });
            })
            .finally(() => {
                mutate('/rooms');
            });
    }, []);

    const handleUpdate = useCallback((values: z.infer<typeof formSchema>) => {
        apiService()
            .put(`/rooms/${room.id}`, values)
            .then(() => {
                toast({
                    title: 'Ruangan berhasil diperbarui'
                });
            })
            .catch(() => {
                toast({
                    title: 'Ruangan gagal diperbarui'
                });
            })
            .finally(() => {
                mutate('/rooms');
                setDialogOpen(false);
            });
    }, []);

    return (
        <TableRow>
            <TableCell className="font-medium">{room.id}</TableCell>
            <TableCell>{room.name}</TableCell>
            <TableCell className="text-right space-x-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger>
                        <Button
                            size="sm"
                            variant="outline">
                            <EditIcon />
                            Ubah
                        </Button>
                    </DialogTrigger>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteData(room.id)}>
                        <DeleteIcon />
                        Hapus
                    </Button>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Perbarui Ruangan</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama ruangan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan nama ruangan"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <DialogFooter>
                                    <DialogClose>
                                        <Button type="button" variant="secondary">Batal</Button>
                                    </DialogClose>
                                    <Button type="submit">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    );
}